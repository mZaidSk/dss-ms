import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { WatchmenAssignment } from '../../models/watchmen-assignments.model';

@Injectable({
  providedIn: 'root',
})
export class WatchmenAssignmentsService {
  private firestore: Firestore = inject(Firestore);
  private assignmentsCollection = collection(
    this.firestore,
    'watchmenAssignments'
  );

  /**
   * Get all assignments with optional filters.
   * Supports filtering by watchmanId, buildingId, wingId, and floorId.
   */
  getAssignments(
    filter: Partial<WatchmenAssignment> = {}
  ): Observable<WatchmenAssignment[]> {
    let assignmentsQuery = query(this.assignmentsCollection);

    if (filter.watchmenId) {
      assignmentsQuery = query(
        this.assignmentsCollection,
        where('watchmenId', '==', filter.watchmenId)
      );
    } else if (filter.buildingId) {
      assignmentsQuery = query(
        this.assignmentsCollection,
        where('buildingId', '==', filter.buildingId)
      );
    }

    return collectionData(assignmentsQuery, {
      idField: 'assignmentId',
    }) as Observable<WatchmenAssignment[]>;
  }

  /**
   * Get a single assignment by ID.
   */
  getAssignmentById(assignmentId: string): Observable<WatchmenAssignment> {
    const assignmentDocRef = doc(
      this.firestore,
      `watchmenAssignments/${assignmentId}`
    );
    return from(getDoc(assignmentDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data();
        return { ...data, assignmentId: snapshot.id } as WatchmenAssignment;
      }),
      catchError((error) => {
        console.error('Error fetching assignment:', error);
        throw error;
      })
    );
  }

  getAssignmentsByBuildingId(buildingId: string): Observable<any[]> {
    const assignmentsQuery = query(
      this.assignmentsCollection,
      where('buildingId', '==', buildingId)
    );

    return collectionData(assignmentsQuery, { idField: 'assignmentId' }).pipe(
      switchMap((assignments: WatchmenAssignment[]) => {
        if (!assignments.length) return from([[]]);

        const enrichedAssignments$ = assignments.map((assignment) => {
          const watchmanDocRef = doc(
            this.firestore,
            `watchmen/${assignment.watchmenId}`
          );

          return combineLatest({
            assignment: from(Promise.resolve(assignment)),
            watchmanDetails: from(getDoc(watchmanDocRef)).pipe(
              map((doc) => ({ id: doc.id, ...doc.data() })),
              catchError(() => 'Watchmen Not Found') // Handle missing watchman
            ),
          });
        });

        return combineLatest(enrichedAssignments$).pipe(
          map((results) =>
            results.map(({ assignment, watchmanDetails }) => ({
              ...assignment,
              watchmanDetails,
            }))
          )
        );
      })
    );
  }

  /**
   * Add a new assignment.
   */
  addAssignment(assignment: WatchmenAssignment): Observable<void> {
    return from(
      addDoc(this.assignmentsCollection, {
        ...assignment,
        createdAt: new Date(),
      })
    ).pipe(map(() => void 0));
  }

  /**
   * Update an existing assignment by ID.
   */
  updateAssignment(
    assignmentId: string,
    updatedData: Partial<WatchmenAssignment>
  ): Observable<void> {
    const assignmentDocRef = doc(
      this.firestore,
      `watchmenAssignments/${assignmentId}`
    );
    return from(
      updateDoc(assignmentDocRef, {
        ...updatedData,
        updatedAt: new Date(),
      })
    ).pipe(map(() => void 0));
  }

  /**
   * Delete an assignment by ID.
   */
  deleteAssignment(assignmentId: string): Observable<void> {
    const assignmentDocRef = doc(
      this.firestore,
      `watchmenAssignments/${assignmentId}`
    );
    return from(deleteDoc(assignmentDocRef)).pipe(map(() => void 0));
  }

  /**
   * Enrich assignments with additional details for watchmen and buildings.
   */
  enrichAssignments(assignments: WatchmenAssignment[]): Observable<any[]> {
    if (!assignments.length) return from([[]]);

    const enrichedAssignments$ = assignments.map((assignment) => {
      const watchmanDocRef = doc(
        this.firestore,
        `watchmen/${assignment.watchmenId}`
      );
      const buildingDocRef = doc(
        this.firestore,
        `buildings/${assignment.buildingId}`
      );

      return combineLatest({
        assignment: from(Promise.resolve(assignment)),
        watchmanDetails: from(getDoc(watchmanDocRef)).pipe(
          map((doc) => ({ id: doc.id, ...doc.data() })),
          catchError(() => 'Watchmen Not Found') // Handle missing watchman
        ),
        buildingDetails: from(getDoc(buildingDocRef)).pipe(
          map((doc) => ({ id: doc.id, ...doc.data() })),
          catchError(() => 'Building Not Found') // Handle missing building
        ),
      });
    });

    return combineLatest(enrichedAssignments$).pipe(
      map((results) =>
        results.map(({ assignment, watchmanDetails, buildingDetails }) => ({
          ...assignment,
          watchmanDetails,
          buildingDetails,
        }))
      )
    );
  }

  /**
   * Get enriched assignments with detailed information.
   */
  getEnrichedAssignments(
    filter: Partial<WatchmenAssignment> = {}
  ): Observable<any[]> {
    return this.getAssignments(filter).pipe(
      switchMap((assignments) => this.enrichAssignments(assignments))
    );
  }
}
