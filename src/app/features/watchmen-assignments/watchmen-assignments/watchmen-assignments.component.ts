import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchmenAssignmentsService } from '../../../shared/services/watchmen-assignments/watchmen-assignments.service';
import { TableComponent } from '../../../core/components/table/table.component';

@Component({
  selector: 'app-watchmen-assignments',
  standalone: true,
  imports: [CommonModule, TableComponent, ReactiveFormsModule],
  templateUrl: './watchmen-assignments.component.html',
  styleUrls: ['./watchmen-assignments.component.scss'],
})
export class WatchmenAssignmentsComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  columns = [
    { key: 'watchmenName', display: 'Watchman Name' },
    { key: 'buildingName', display: 'Building' },
    { key: 'wingName', display: 'Wing' },
    { key: 'startTime', display: 'Start Time' },
    { key: 'endTime', display: 'End Time' },
    { key: 'assignedAt', display: 'Assigned At' },
  ];

  tableData: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private assignmentsService: WatchmenAssignmentsService,
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
    this.assignmentsService.getEnrichedAssignments(filters).subscribe({
      next: (data: any[]) => {
        this.tableData = data.map(this.mapAssignmentData);
        console.log(this.tableData);
      },
      error: (err) => console.error('Error fetching assignments:', err),
    });
  }

  private mapAssignmentData(assignment: any) {
    const {
      watchmanDetails,
      buildingDetails,
      wingName,
      endTime,
      startTime,
      createdAt,
      ...rest
    } = assignment;

    return {
      watchmenName: `${watchmanDetails.firstName} ${watchmanDetails.lastName}`,
      buildingName: buildingDetails.name,
      wingName: wingName,
      startTime,
      endTime,
      assignedAt: createdAt
        ? new Date(createdAt.seconds * 1000).toLocaleString() // Convert to a readable date
        : null,
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
      this.assignmentsService
        .deleteAssignment(assignment.assignmentId)
        .subscribe({
          next: () => this.fetchAssignments(),
          error: (err) => console.error('Error deleting assignment:', err),
        })
    );
  }

  addNewAssignment(): void {
    this.router.navigate([`watchmen-assignments/add`]);
  }
}
