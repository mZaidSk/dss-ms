import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, addDoc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map to transform the data
import { Wing } from '../../models/wing.model';

@Injectable({
  providedIn: 'root'
})
export class WingService {
  private firestore: Firestore = inject(Firestore);
  private wingCollection = collection(this.firestore, 'wings');

  // Get all wings
  getWings(): Observable<Wing[]> {
    return collectionData(this.wingCollection, { idField: 'wingId' }) as Observable<Wing[]>;
  }

  // Get wing by ID
  getWingById(wingId: string): Observable<Wing> {
    const wingDocRef = doc(this.firestore, `wings/${wingId}`);

    // Convert Promise to Observable and map the document snapshot to Wing
    return from(getDoc(wingDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data() as Wing;
        return { ...data, wingId: snapshot.id }; // Return the wing with the ID
      })
    );
  }

  // Add a new wing
  addWing(wing: Wing) {
    return addDoc(this.wingCollection, wing);
  }

  // Update an existing wing
  updateWing(wingId: string, data: Partial<Wing>) {
    const wingDocRef = doc(this.firestore, `wings/${wingId}`);
    return updateDoc(wingDocRef, data);
  }

  // Delete a wing
  deleteWing(wingId: string) {
    const wingDocRef = doc(this.firestore, `wings/${wingId}`);
    return deleteDoc(wingDocRef);
  }
}
