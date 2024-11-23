import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Building } from '../../../shared/models/building.model';
import { BuildingService } from '../../../shared/services/building/building.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../core/components/loading/loading.component";
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service';
import { watchmen } from '../../../shared/models/watchmen.model';

@Component({
  selector: 'app-building-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.scss']
})
export class BuildingDetailComponent implements OnInit {
  buildingId!: string;  // Store the building ID
  building$!: Observable<Building>;  // Observable to hold the building data
  watchmen$: { [id: string]: watchmen } = {};

  constructor(
    private route: ActivatedRoute,
    private buildingService: BuildingService,  // Inject the service
    private watchmenService: watchmenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get the building ID from the route
    this.route.paramMap.subscribe(params => {
      this.buildingId = params.get('id') || '';
      if (this.buildingId) {
        // Fetch the building details using the service
        this.building$ = this.buildingService.getBuildingById(this.buildingId);
        this.building$.subscribe(result => {
          console.log(result);
        })
      }
    });

    this.watchmenService.getWatchmen().subscribe((watchmen) => {
      this.watchmen$ = watchmen.reduce((acc: any, watchmen) => {
        if (watchmen.watchmenId)
          acc[watchmen.watchmenId] = watchmen;

        return acc;
      }, {});
    });
  }

  // Add this utility function to your component's TypeScript file
  generateArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  handleEdit(data: Building): void {
    this.router.navigate([`building/edit/${data.buildingId}`]);
  }

  handleRoom(building: Building, wingName: string, floor: number, roomNumber: number) {
    const roomId = `${wingName}-${floor.toString().padStart(2, '0')}${roomNumber.toString().padStart(2, '0')}`;
    // Now you can navigate or do whatever you need with the roomId
    console.log('Room ID:', roomId);
    // For example, navigate to the room detail page
    this.router.navigate(['building', building.buildingId, 'rooms', roomId]);
  }

  handleView(watchmenId: String): void {
    this.router.navigate([`watchmen/${watchmenId}`]);
  }
}
