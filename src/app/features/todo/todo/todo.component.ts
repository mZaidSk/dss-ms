import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../../shared/services/todo/todo.service';
import { Todo } from '../../../shared/models/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];

  // Define the Reactive Form Group
  todoForm: FormGroup;

  constructor(private todoService: TodoService) {
    // Initialize the form group with controls
    this.todoForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]), // Title field with validators
      description: new FormControl(''), // Description field
      completed: new FormControl(false) // Completed field (default to false)
    });
  }

  ngOnInit(): void {
    this.getTodos();
  }

  // Get all todos from the service
  getTodos() {
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos = todos;
    });
  }

  // Add a new todo using Reactive Form
  addTodo() {
    if (this.todoForm.valid) {
      const newTodo: Todo = this.todoForm.value; // Get the form value as a Todo object
      this.todoService.addTodo(newTodo).then(() => {
        this.todoForm.reset({ title: '', description: '', completed: false }); // Reset the form after submission
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Update an existing todo (for fields other than 'completed')
  updateTodo(todo: Todo) {
    console.log('Updating todo: ', todo);
    if (todo.id) {
      this.todoService.updateTodo(todo.id, { ...todo });
    }
  }

  // Update only the 'completed' status
  updateTodoCompletion(todo: Todo) {
    if (todo.id) {
      this.todoService.updateTodo(todo.id, { completed: todo.completed });
    }
  }

  // Delete a todo
  deleteTodo(id: string | undefined) {
    if (id) {
      this.todoService.deleteTodo(id);
    }
  }

  // Toggle completion status and update it in Firestore
  toggleCompletion(todo: Todo) {
    todo.completed = !todo.completed;
    this.updateTodoCompletion(todo);
  }
}
