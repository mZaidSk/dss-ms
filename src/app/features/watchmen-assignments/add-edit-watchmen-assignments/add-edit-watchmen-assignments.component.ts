import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BuildingService } from '../../../shared/services/building/building.service';
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service';
import { WatchmenAssignment } from '../../../shared/models/watchmen-assignments.model';
import { WatchmenAssignmentsService } from '../../../shared/services/watchmen-assignments/watchmen-assignments.service';

@Component({
  selector: 'app-add-edit-watchmen-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-edit-watchmen-assignments.component.html',
  styleUrls: ['./add-edit-watchmen-assignments.component.scss'],
})
export class AddEditWatchmenAssignmentsComponent implements OnInit {
  assignmentForm!: FormGroup;
  isEditMode: boolean = false;
  currentAssignmentId?: string;
  watchmenList: any[] = [];
  buildingList: any[] = [];
  filteredWings: any[] = [];
  loading: boolean = false; // Loading state
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private watchmenService: watchmenService,
    private buildingService: BuildingService,
    private assignmentsService: WatchmenAssignmentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();

    const assignmentId = this.route.snapshot.paramMap.get('id');
    if (assignmentId) {
      this.isEditMode = true;
      this.currentAssignmentId = assignmentId;
      this.loadAssignment(assignmentId);
    }

    this.assignmentForm
      .get('temporary')
      ?.valueChanges.subscribe((isTemporary) =>
        this.toggleDateValidators(isTemporary)
      );

    this.assignmentForm
      .get('buildingId')
      ?.valueChanges.subscribe((buildingId) => this.updateWings(buildingId));
  }

  initializeForm(): void {
    this.assignmentForm = this.fb.group({
      watchmenId: ['', Validators.required],
      buildingId: ['', Validators.required],
      wingName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      temporary: [false],
      startDate: [{ value: '', disabled: true }],
      endDate: [{ value: '', disabled: true }],
    });
  }

  toggleDateValidators(isTemporary: boolean): void {
    const startDateControl = this.assignmentForm.get('startDate');
    const endDateControl = this.assignmentForm.get('endDate');

    if (isTemporary) {
      startDateControl?.setValidators(Validators.required);
      endDateControl?.setValidators(Validators.required);
      startDateControl?.enable();
      endDateControl?.enable();
    } else {
      startDateControl?.clearValidators();
      endDateControl?.clearValidators();
      startDateControl?.disable();
      endDateControl?.disable();
    }

    startDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  loadData(): void {
    this.loading = true; // Set loading state to true

    this.watchmenService.getWatchmen().subscribe((data) => {
      this.watchmenList = data;
      this.loading = false; // Set loading state to false when data is loaded
    });

    this.buildingService.getBuildings().subscribe((data) => {
      this.buildingList = data;
      this.loading = false; // Set loading state to false when data is loaded
    });
  }

  updateWings(buildingId: string): void {
    const selectedBuilding = this.buildingList.find(
      (building) => building.buildingId === buildingId
    );
    this.filteredWings = selectedBuilding?.wings || [];
    this.assignmentForm.get('wingName')?.reset();
  }

  loadAssignment(assignmentId: string): void {
    this.loading = true; // Set loading state to true

    this.assignmentsService
      .getAssignmentById(assignmentId)
      .subscribe((assignment) => {
        this.assignmentForm.patchValue(assignment);
        this.loading = false; // Set loading state to false when assignment is loaded
      });
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      this.isSubmitting = true; // Enable submitting state
      const formValue: WatchmenAssignment = this.assignmentForm.value;

      if (this.isEditMode && this.currentAssignmentId) {
        this.assignmentsService
          .updateAssignment(this.currentAssignmentId, formValue)
          .subscribe({
            next: () => {
              console.log('Assignment updated');
              this.router.navigate(['watchmen-assignments']);
            },
            error: (err) => {
              console.error('Error updating assignment:', err);
            },
            complete: () => {
              this.isSubmitting = false; // Disable submitting state
            },
          });
      } else {
        this.assignmentsService.addAssignment(formValue).subscribe({
          next: () => {
            console.log('Assignment created');
            this.router.navigate(['watchmen-assignments']);
          },
          error: (err) => {
            console.error('Error creating assignment:', err);
          },
          complete: () => {
            this.isSubmitting = false; // Disable submitting state
          },
        });
      }
    }
  }

  onReset(): void {
    this.assignmentForm.reset();
  }
}
