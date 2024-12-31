import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
  where,
  query,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private firestore: Firestore = inject(Firestore);
  private buildingCollection = collection(this.firestore, 'buildings');
  private watchmenCollection = collection(this.firestore, 'watchmen');
  private feedbackCollection = collection(this.firestore, 'feedback');

  private watchmenAssignmentsCollection = collection(
    this.firestore,
    'watchmenAssignments'
  );

  // Get the total number of buildings
  getNumberOfBuildings(): Observable<number> {
    const buildingQuery = query(this.buildingCollection);
    return from(getDocs(buildingQuery)).pipe(map((snapshot) => snapshot.size));
  }

  getNumberOfWatchman(): Observable<number> {
    const watchmenQuery = query(this.watchmenCollection);
    return from(getDocs(watchmenQuery)).pipe(map((snapshot) => snapshot.size));
  }

  getNumberOfFeedback(): Observable<number> {
    const FeedbackQuery = query(this.feedbackCollection);
    return from(getDocs(FeedbackQuery)).pipe(map((snapshot) => snapshot.size));
  }

  getNumberOfWatchmanAssignments(): Observable<number> {
    const watchmenAssignmentsQuery = query(this.watchmenAssignmentsCollection);
    return from(getDocs(watchmenAssignmentsQuery)).pipe(
      map((snapshot) => snapshot.size)
    );
  }
  // ... other dashboard-related methods (if any) ...
}
