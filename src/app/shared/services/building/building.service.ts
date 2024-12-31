import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  where,
  writeBatch,
  setDoc,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Building, Wing } from '../../models/building.model';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private firestore: Firestore = inject(Firestore);
  private buildingCollection = collection(this.firestore, 'buildings');

  // Get buildings with pagination and optional search
  getBuildings(
    pageSize: number = 10,
    lastBuilding?: Building,
    searchTerm?: string
  ): Observable<Building[]> {
    let buildingQuery = query(this.buildingCollection);

    // Apply search filter if a search term is provided
    if (searchTerm) {
      buildingQuery = query(
        this.buildingCollection,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(pageSize)
      );
    } else if (lastBuilding) {
      // If there is a lastBuilding, use it to start after that document for the next page
      buildingQuery = query(
        this.buildingCollection,
        orderBy('name'),
        startAfter(lastBuilding.name),
        limit(pageSize)
      );
    } else {
      // First page, no startAfter
      buildingQuery = query(
        this.buildingCollection,
        orderBy('name'),
        limit(pageSize)
      );
    }

    // Return paginated buildings
    return collectionData(buildingQuery, {
      idField: 'buildingId',
    }) as Observable<Building[]>;
  }

  // Get building by ID
  getBuildingById(buildingId: string): Observable<Building> {
    const buildingDocRef = doc(this.firestore, `buildings/${buildingId}`);
    return from(getDoc(buildingDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data() as Building;
        return { ...data, buildingId: snapshot.id };
      })
    );
  }

  // Add a new building and generate rooms
  addBuilding(building: Building) {
    // Create a document reference with the custom ID (e.g., the building name)
    const buildingId = building.name; // bname
    const buildingDocRef = doc(this.buildingCollection, buildingId);

    return setDoc(buildingDocRef, building).then(() => {
      this.generateRoomsForBuilding(buildingId, building.wings);
      return buildingId;
    });
  }

  // Update an existing building and regenerate rooms if wings change
  updateBuilding(buildingId: string, data: Partial<Building>) {
    const buildingDocRef = doc(this.firestore, `buildings/${buildingId}`);

    // Get current wings and check if they need updating
    return getDoc(buildingDocRef).then((snapshot) => {
      const currentBuildingData = snapshot.data() as Building;

      // Update building data
      return updateDoc(buildingDocRef, data).then(() => {
        // Delete existing rooms
        this.deleteExistingRooms(buildingId).then(() => {
          // Generate new rooms based on updated wings
          if (data.wings) this.generateRoomsForBuilding(buildingId, data.wings);
        });
      });
    });
  }

  // Delete a building
  deleteBuilding(buildingId: string) {
    const buildingDocRef = doc(this.firestore, `buildings/${buildingId}`);
    return deleteDoc(buildingDocRef);
  }

  // Delete existing rooms for a building
  private deleteExistingRooms(buildingId: string): Promise<void> {
    const roomsCollectionRef = collection(
      this.firestore,
      `buildings/${buildingId}/rooms`
    );
    return getDocs(roomsCollectionRef).then((snapshot) => {
      const batch = writeBatch(this.firestore);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }

  // Generate room records based on building wings, floors, and rooms per floor
  private generateRoomsForBuilding(buildingId: string, wings: Wing[]) {
    console.log('building id: ' + buildingId);
    console.log(wings);

    const batch = writeBatch(this.firestore);
    type rooms = {
      roomId: string;
      PhoneNumber: string;
      name: string;
      wing: string;
      floor: number;
      roomNumber: number;
      username: string;
      password: string;
      status: string;
      isFirst: boolean;
    };

    wings.forEach((wing) => {
      for (let floor = 1; floor <= wing.numberOfFloors; floor++) {
        for (let room = 1; room <= wing.roomsPerFloor; room++) {
          const roomId = `${wing.wingName}-${floor
            .toString()
            .padStart(2, '0')}${room.toString().padStart(2, '0')}`;
          const roomData: rooms = {
            roomId,
            PhoneNumber: '',
            name: '',
            wing: wing.wingName,
            floor,
            roomNumber: room,
            username: buildingId + '_' + roomId,
            password: 'password',
            status: '',
            isFirst: false,
          };

          const roomDocRef = doc(
            this.firestore,
            `buildings/${buildingId}/rooms/${roomId}`
          );
          batch.set(roomDocRef, roomData);
        }
      }
    });

    // Commit the batch
    batch
      .commit()
      .then(() => {
        console.log('Rooms generated successfully for the building.');
      })
      .catch((error) => {
        console.error('Error generating rooms: ', error);
      });
  }
}
