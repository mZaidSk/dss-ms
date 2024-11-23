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
  query,
  orderBy,
  startAfter,
  limit,
  where,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { watchmen } from '../../models/watchmen.model';

@Injectable({
  providedIn: 'root',
})
export class watchmenService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private watchmenCollection = collection(this.firestore, 'watchmen');

  // Get watchmen with pagination and optional search
  getWatchmen(
    pageSize: number = 10,
    lastwatchmen?: watchmen,
    searchTerm?: string
  ): Observable<watchmen[]> {
    let watchmenQuery = query(this.watchmenCollection);

    if (searchTerm) {
      watchmenQuery = query(
        this.watchmenCollection,
        where('firstName', '>=', searchTerm),
        where('firstName', '<=', searchTerm + '\uf8ff'),
        orderBy('firstName'),
        limit(pageSize)
      );
    } else if (lastwatchmen) {
      const lastwatchmenDocRef = doc(
        this.firestore,
        `watchmen/${lastwatchmen.watchmenId}`
      );
      watchmenQuery = query(
        this.watchmenCollection,
        orderBy('firstName'),
        startAfter(lastwatchmenDocRef),
        limit(pageSize)
      );
    } else {
      watchmenQuery = query(
        this.watchmenCollection,
        orderBy('firstName'),
        limit(pageSize)
      );
    }

    return collectionData(watchmenQuery, {
      idField: 'watchmenId',
    }) as Observable<watchmen[]>;
  }

  // Get watchmen by ID
  getwatchmenById(watchmenId: string): Observable<watchmen> {
    const watchmenDocRef = doc(this.firestore, `watchmen/${watchmenId}`);
    return from(getDoc(watchmenDocRef)).pipe(
      map((snapshot) => {
        const data = snapshot.data() as watchmen;
        return { ...data, watchmenId: snapshot.id };
      })
    );
  }

  // Add a new watchmen with an optional photo
  addwatchmen(watchmen: watchmen, photoFile?: File): Observable<void> {
    const timestamp = new Date();

    if (photoFile) {
      const photoRef = ref(
        this.storage,
        `watchmen/${photoFile.name}_${timestamp.getTime()}`
      );
      return from(uploadBytes(photoRef, photoFile)).pipe(
        switchMap(() => getDownloadURL(photoRef)),
        switchMap((photoURL) => {
          return from(
            addDoc(this.watchmenCollection, {
              ...watchmen,
              photoURL,
              createdAt: timestamp,
              updatedAt: timestamp,
            })
          );
        }),
        map(() => void 0) // Convert the returned observable to `Observable<void>`
      );
    } else {
      return from(
        addDoc(this.watchmenCollection, {
          ...watchmen,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      ).pipe(map(() => void 0));
    }
  }

  // Update an existing watchmen with an optional new photo
  updatewatchmen(
    watchmenId: string,
    data: Partial<watchmen>,
    newPhotoFile?: File
  ): Observable<void> {
    const watchmenDocRef = doc(this.firestore, `watchmen/${watchmenId}`);
    const updatedData = { ...data, updatedAt: new Date() };

    if (newPhotoFile) {
      const photoRef = ref(
        this.storage,
        `watchmen/${newPhotoFile.name}_${updatedData.updatedAt.getTime()}`
      );
      return from(uploadBytes(photoRef, newPhotoFile)).pipe(
        switchMap(() => getDownloadURL(photoRef)),
        switchMap((photoURL) => {
          return from(updateDoc(watchmenDocRef, { ...updatedData, photoURL }));
        }),
        map(() => void 0)
      );
    } else {
      return from(updateDoc(watchmenDocRef, updatedData)).pipe(
        map(() => void 0)
      );
    }
  }

  // Delete a watchmen
  deletewatchmen(watchmenId: string): Observable<void> {
    const watchmenDocRef = doc(this.firestore, `watchmen/${watchmenId}`);
    return from(deleteDoc(watchmenDocRef)).pipe(map(() => void 0));
  }
}
