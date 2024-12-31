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
import { Observable, forkJoin, from, of, zip } from 'rxjs';
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
  addwatchmen(
    watchmen: watchmen,
    photoFile?: File,
    documents?: { [key: string]: File }
  ): Observable<void> {
    const timestamp = new Date();

    // Upload photo if available
    const uploadPhoto$ = photoFile ? this.uploadFile(photoFile) : of(null);
    // Upload documents if available
    const uploadDocuments$ = documents
      ? this.uploadDocuments(documents)
      : of({});

    return zip(uploadPhoto$, uploadDocuments$).pipe(
      switchMap(([photoURL, documentURLs]) => {
        return from(
          addDoc(this.watchmenCollection, {
            ...watchmen,
            photoURL,
            documents: documentURLs,
            createdAt: timestamp,
            updatedAt: timestamp,
          })
        );
      }),
      map(() => void 0) // Convert to `Observable<void>`
    );
  }

  // Update an existing watchmen with an optional new photo and documents
  updatewatchmen(
    watchmenId: string,
    data: Partial<watchmen>,
    newPhotoFile?: File,
    newDocuments?: { [key: string]: File }
  ): Observable<void> {
    const watchmenDocRef = doc(this.firestore, `watchmen/${watchmenId}`);
    const updatedData = { ...data, updatedAt: new Date() };

    // Upload new photo if available
    const uploadPhoto$ = newPhotoFile
      ? this.uploadFile(newPhotoFile)
      : of(null);
    // Upload new documents if available
    const uploadDocuments$ = newDocuments
      ? this.uploadDocuments(newDocuments)
      : of({});

    return zip(uploadPhoto$, uploadDocuments$).pipe(
      switchMap(([photoURL, documentURLs]) => {
        const finalData = { ...updatedData, photoURL, documents: documentURLs };
        return from(updateDoc(watchmenDocRef, finalData));
      }),
      map(() => void 0)
    );
  }

  // Helper method to upload photo to Firebase Storage
  private uploadFile(file: File): Observable<string> {
    const fileRef = ref(
      this.storage,
      `watchmen/photos/${file.name}_${new Date().getTime()}`
    );
    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => getDownloadURL(fileRef))
    );
  }

  // Helper method to upload documents to Firebase Storage
  private uploadDocuments(documents: {
    [key: string]: File;
  }): Observable<{ [key: string]: string }> {
    const documentUploads: Observable<{ [key: string]: string }>[] = [];

    Object.keys(documents).forEach((docType) => {
      const file = documents[docType];
      const fileRef = ref(
        this.storage,
        `watchmen/documents/${docType}_${file.name}_${new Date().getTime()}`
      );
      documentUploads.push(
        from(uploadBytes(fileRef, file)).pipe(
          switchMap(() => getDownloadURL(fileRef)),
          map((url) => ({ [docType]: url }))
        )
      );
    });

    return forkJoin(documentUploads).pipe(
      map((documentURLs) => {
        // Merge all document URLs into a single object
        return documentURLs.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      })
    );
  }

  // Delete a watchmen
  deletewatchmen(watchmenId: string): Observable<void> {
    const watchmenDocRef = doc(this.firestore, `watchmen/${watchmenId}`);
    return from(deleteDoc(watchmenDocRef)).pipe(map(() => void 0));
  }
}
