import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, addDoc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map to transform the data
import { Visitor } from '../../models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private firestore: Firestore = inject(Firestore);
  private visitorCollection = collection(this.firestore, 'visitors');

  // Get all visitors
  getVisitors(): Observable<Visitor[]> {
    return collectionData(this.visitorCollection, { idField: 'visitorId' }) as Observable<Visitor[]>;
  }

  // Get visitor by ID
  getVisitorById(visitorId: string): Observable<Visitor> {
    const visitorDocRef = doc(this.firestore, `visitors/${visitorId}`);

    // Convert Promise to Observable and map the document snapshot to Visitor
    return from(getDoc(visitorDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data() as Visitor;
        return { ...data, visitorId: snapshot.id }; // Return the visitor with the ID
      })
    );
  }

  // Add a new visitor
  addVisitor(visitor: Visitor) {
    return addDoc(this.visitorCollection, visitor);
  }

  // Update an existing visitor
  updateVisitor(visitorId: string, data: Partial<Visitor>) {
    const visitorDocRef = doc(this.firestore, `visitors/${visitorId}`);
    return updateDoc(visitorDocRef, data);
  }

  // Delete a visitor
  deleteVisitor(visitorId: string) {
    const visitorDocRef = doc(this.firestore, `visitors/${visitorId}`);
    return deleteDoc(visitorDocRef);
  }
}
