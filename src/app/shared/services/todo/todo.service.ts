import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore
  private todoCollection = collection(this.firestore, 'todos'); // Define collection reference

  // Get all todos
  getTodos(): Observable<Todo[]> {
    return collectionData(this.todoCollection, { idField: 'id' }) as Observable<Todo[]>;
  }

  // Add a new todo
  addTodo(todo: Todo) {
    return addDoc(this.todoCollection, todo);
  }

  // Update an existing todo
  updateTodo(id: string, data: Partial<Todo>) {
    const todoDocRef = doc(this.firestore, `todos/${id}`); // Reference specific document
    return updateDoc(todoDocRef, data);
  }

  // Delete a todo
  deleteTodo(id: string) {
    const todoDocRef = doc(this.firestore, `todos/${id}`); // Reference specific document
    return deleteDoc(todoDocRef);
  }
}
