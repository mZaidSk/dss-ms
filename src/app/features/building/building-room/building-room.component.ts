import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // For route parameters
import { Observable } from 'rxjs';
import { Room } from '../../../shared/models/room.model';
import { RoomService } from '../../../shared/services/room/room.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-building-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './building-room.component.html',
  styleUrl: './building-room.component.scss'
})
export class BuildingRoomComponent {
  room$!: Observable<any | undefined>; // Observable for a single room
  buildingId!: string; // To store the building ID
  roomId!: string; // To store the room ID

  visitors = [
    {
      photo: 'https://via.placeholder.com/150',
      name: 'John Doe',
      phoneNo: '123-456-7890',
      noOfVisitors: 3,
      from: 'City A',
      purpose: 'Meeting',
      status: "In"
    },
    {
      photo: 'https://via.placeholder.com/150',
      name: 'Jane Smith',
      phoneNo: '987-654-3210',
      noOfVisitors: 2,
      from: 'City B',
      purpose: 'Tour',
      status: "Completed"
    },
  ];


  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute, // To get the route parameters
    private location: Location
  ) { }

  ngOnInit(): void {
    // Get the building ID and room ID from the route
    this.buildingId = this.route.snapshot.paramMap.get('buildingId') || '';
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    // Fetch the room details for the specific building and room
    this.room$ = this.roomService.getRoomById(this.buildingId, this.roomId);
    this.room$.subscribe(room => {
      console.log(room);

    })
  }

  goBack(): void {
    this.location.back();
  }

}
