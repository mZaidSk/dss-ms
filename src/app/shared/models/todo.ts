export interface Todo {
  id?: string;         // Optional because Firestore auto-generates IDs
  title: string;
  description?: string; // Optional
  completed: boolean;
}
