import { watchmen } from './../../../shared/models/watchmen.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service';
import { TableComponent } from '../../../core/components/table/table.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watchmen',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './watchmen.component.html',
  styleUrls: ['./watchmen.component.scss'],
})
export class watchmenComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  columns = [
    { key: 'firstName', display: 'First Name' },
    { key: 'lastName', display: 'Last Name' },
    { key: 'phoneNumber', display: 'Phone No.' },
    { key: 'aadharNumber', display: 'Aadhar Number' },
  ];

  tableData: any[] = [];
  pageSize = 10; // Pagination size
  lastwatchmen?: watchmen;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private watchmenService: watchmenService,
    private router: Router
  ) {
    // Initialize search form
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.fetchWatchmen(); // Fetch initial list of watchmen

    // Subscribe to search form value changes
    this.subscriptions.add(
      this.searchForm.get('search')?.valueChanges.subscribe((searchText) => {
        this.fetchWatchmen(searchText); // Fetch watchmen based on search text
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }

  // Fetch list of watchmen with pagination and search
  private fetchWatchmen(search: string = ''): void {
    this.watchmenService
      .getWatchmen(this.pageSize, this.lastwatchmen, search)
      .subscribe({
        next: (data: watchmen[]) => {
          this.tableData = [];
          if (search) {
            this.tableData = data.map(this.mapwatchmenData); // Map search results directly
          } else {
            this.tableData.push(...data.map(this.mapwatchmenData)); // Append new data for pagination
          }
        },
        error: (err) => console.error('Error fetching watchmen:', err), // Handle errors
      });
  }

  // Function to map watchmen data for the table
  private mapwatchmenData(watchmen: watchmen) {
    const { watchmenId, firstName, lastName, phoneNumber, aadharNumber } =
      watchmen;
    return { watchmenId, firstName, lastName, phoneNumber, aadharNumber };
  }

  handleView(watchmen: watchmen): void {
    this.router.navigate([`watchmen/${watchmen.watchmenId}`]);
  }

  // Handle edit action
  handleEdit(watchmen: watchmen): void {
    this.router.navigate([`watchmen/edit/${watchmen.watchmenId}`]);
  }

  // Handle delete action
  handleDelete(watchmen: watchmen): void {
    if (watchmen.watchmenId) {
      this.subscriptions.add(
        this.watchmenService.deletewatchmen(watchmen.watchmenId).subscribe({
          next: () => {
            console.log('watchmen deleted:', watchmen.watchmenId);
            this.fetchWatchmen(); // Refresh watchmen list after deletion
          },
          error: (err) => console.error('Error deleting watchmen:', err), // Handle delete errors
        })
      );
    }
  }

  // Add a new watchmen
  addNewwatchmen(): void {
    this.router.navigate([`watchmen/add`]);
  }
}
