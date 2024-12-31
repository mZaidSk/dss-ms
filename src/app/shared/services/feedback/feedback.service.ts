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
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Feedback } from '../../models/feedback.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private firestore: Firestore = inject(Firestore);
  private feedbackCollection = collection(this.firestore, 'feedback');

  /**
   * Get all feedback with optional filters.
   */
  getFeedback(filter: Partial<Feedback> = {}): Observable<Feedback[]> {
    let feedbackQuery = query(this.feedbackCollection);

    // if (filter.userId) {
    //   feedbackQuery = query(
    //     this.feedbackCollection,
    //     where('userId', '==', filter.userId)
    //   );
    // } else if (filter.status) {
    //   feedbackQuery = query(
    //     this.feedbackCollection,
    //     where('status', '==', filter.status)
    //   );
    // }

    return collectionData(feedbackQuery, {
      idField: 'feedbackId',
    }) as Observable<Feedback[]>;
  }

  /**
   * Get feedback by ID.
   */
  // getFeedbackById(feedbackId: string): Observable<Feedback> {
  //   const feedbackDocRef = doc(this.firestore, `feedback/${feedbackId}`);
  //   return from(getDoc(feedbackDocRef)).pipe(
  //     map((snapshot) => {
  //       const data = snapshot.data();
  //       return { ...data, feedbackId: snapshot.id } as Feedback;
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching feedback:', error);
  //       throw error;
  //     })
  //   );
  // }

  /**
   * Add new feedback.
   */
  addFeedback(feedback: Feedback): Observable<void> {
    return from(
      addDoc(this.feedbackCollection, {
        ...feedback,
        createdAt: new Date(),
      })
    ).pipe(map(() => void 0));
  }

  /**
   * Update feedback by ID.
   */
  updateFeedback(
    feedbackId: string,
    updatedData: Partial<Feedback>
  ): Observable<void> {
    const feedbackDocRef = doc(this.firestore, `feedback/${feedbackId}`);
    return from(
      updateDoc(feedbackDocRef, {
        ...updatedData,
        updatedAt: new Date(),
      })
    ).pipe(map(() => void 0));
  }

  /**
   * Delete feedback by ID.
   */
  deleteFeedback(feedbackId: string): Observable<void> {
    const feedbackDocRef = doc(this.firestore, `feedback/${feedbackId}`);
    return from(deleteDoc(feedbackDocRef)).pipe(map(() => void 0));
  }
}
