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
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private firestore: Firestore = inject(Firestore);

  // Get all rooms for a specific building
  getRooms(buildingId: string): Observable<Room[]> {
    const roomCollection = collection(this.firestore, `buildings/${buildingId}/rooms`);
    return collectionData(roomCollection, { idField: 'roomId' }) as Observable<Room[]>;
  }

  // Get room by ID within a specific building
  getRoomById(buildingId: string, roomId: string): Observable<Room> {
    const roomDocRef = doc(this.firestore, `buildings/${buildingId}/rooms/${roomId}`);
    return from(getDoc(roomDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data() as Room;
        return { ...data, roomId: snapshot.id }; // Return the room with the ID
      })
    );
  }

  // Add a new room to a specific building
  addRoom(buildingId: string, room: Room) {
    const roomCollection = collection(this.firestore, `buildings/${buildingId}/rooms`);
    return addDoc(roomCollection, room);
  }

  // Update an existing room within a specific building
  updateRoom(buildingId: string, roomId: string, data: Partial<Room>) {
    const roomDocRef = doc(this.firestore, `buildings/${buildingId}/rooms/${roomId}`);
    return updateDoc(roomDocRef, data);
  }

  // Delete a room from a specific building
  deleteRoom(buildingId: string, roomId: string) {
    const roomDocRef = doc(this.firestore, `buildings/${buildingId}/rooms/${roomId}`);
    return deleteDoc(roomDocRef);
  }
}
