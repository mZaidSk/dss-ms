import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoComponent } from './features/todo/todo/todo.component';
import { SampleComponent } from "./features/sample/sample/sample.component";
import { Building } from './shared/models/building.model';
import { Wing } from './shared/models/wing.model';
import { Room } from './shared/models/room.model';
import { Visitor } from './shared/models/visitor.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoComponent, SampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dss-ms';
}
