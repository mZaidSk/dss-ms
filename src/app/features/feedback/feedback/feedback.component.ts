import { Component } from '@angular/core';
import { Feedback } from '../../../shared/models/feedback.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { FeedbackService } from '../../../shared/services/feedback/feedback.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../core/components/table/table.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  searchForm!: FormGroup;
  columns = [
    { key: 'username', display: 'Username' },
    { key: 'buildingName', display: 'building' },
    { key: 'wing', display: 'Wing' },
    { key: 'room', display: 'Room' },
    { key: 'content', display: 'Content' },
  ];

  tableData: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.fetchAssignments();

    // Subscribe to search form changes
    this.subscriptions.add(
      this.searchForm.valueChanges.subscribe((filters) => {
        this.fetchAssignments(filters);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private fetchAssignments(filters: any = {}): void {
    this.feedbackService.getFeedback(filters).subscribe({
      next: (data: any[]) => {
        this.tableData = data.map(this.mapFeedbackData);
        console.log(this.tableData);
      },
      error: (err) => console.error('Error fetching assignments:', err),
    });
  }

  private mapFeedbackData(feedback: any) {
    console.log(feedback);
    const { content, date, feedbackId, room, time, username, wing, ...rest } =
      feedback;

    return {
      content: content,
      username,
      buildingName: username.split('_')[0],
      wing,
      room,
      date,
      ...rest, // Include any other remaining properties
    };
  }

  handleView(assignment: any): void {
    this.router.navigate([`watchmen-assignments/${assignment.assignmentId}`]);
  }

  handleEdit(assignment: any): void {
    this.router.navigate([
      `watchmen-assignments/edit/${assignment.assignmentId}`,
    ]);
  }

  handleDelete(assignment: any): void {
    this.subscriptions.add(
      this.feedbackService.deleteFeedback(assignment.assignmentId).subscribe({
        next: () => this.fetchAssignments(),
        error: (err) => console.error('Error deleting assignment:', err),
      })
    );
  }

  addNewAssignment(): void {
    this.router.navigate([`watchmen-assignments/add`]);
  }
}
