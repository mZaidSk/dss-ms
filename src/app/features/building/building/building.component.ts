import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableComponent } from '../../../core/components/table/table.component';
import { Building } from '../../../shared/models/building.model';
import { BuildingService } from '../../../shared/services/building/building.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [TableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  columns = [
    { key: 'name', display: 'Building Name' },
    { key: 'city', display: 'City' },
    { key: 'state', display: 'State' },
    { key: 'pincode', display: 'Pincode' },
    { key: 'address', display: 'Address' },
  ];

  tableData: any[] = [];
  pageSize = 5;
  lastBuilding?: Building;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      search: [''], // Initialize with an empty string
    });
  }

  ngOnInit(): void {
    this.fetchBuildings(); // Fetch initial list of buildings

    // Subscribe to search control changes
    this.subscriptions.add(
      this.searchForm.get('search')?.valueChanges.subscribe((searchText) => {
        this.fetchBuildings(searchText); // Pass search text to fetch buildings
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }

  // Fetch list of buildings from Firestore with pagination and search
  private fetchBuildings(search: string = ''): void {
    this.buildingService.getBuildings(this.pageSize, this.lastBuilding, search)
      .subscribe({
        next: (data: Building[]) => {
          this.tableData = []
          if (search) {
            this.tableData = data.map(this.mapBuildingData); // Map directly to tableData
          } else {
            this.tableData.push(...data.map(this.mapBuildingData)); // Append to existing data
          }
        },
        error: (err) => console.error('Error fetching buildings:', err), // Handle errors
      });
  }

  // Function to map building data for the table
  private mapBuildingData(building: Building) {
    const { buildingId, name, location: { city, state, pincode, address } } = building;
    return { buildingId, name, city, state, pincode, address };
  }

  handleView(data: Building): void {
    this.router.navigate([`building/${data.buildingId}`]);
  }
  // Function to handle edit action
  handleEdit(data: Building): void {
    this.router.navigate([`building/edit/${data.buildingId}`]);
  }

  // Function to handle delete action
  handleDelete(building: Building): void {
    this.buildingService.deleteBuilding(building.buildingId).then(() => {
      console.log('Building deleted:', building.buildingId);
      this.fetchBuildings(); // Refresh list after deletion
    }).catch(err => console.error('Error deleting building:', err)); // Handle delete errors
  }

  // Add a new building
  addNewBuilding(): void {
    this.router.navigate([`building/add`]);
  }
}
