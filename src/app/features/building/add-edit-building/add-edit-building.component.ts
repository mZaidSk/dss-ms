import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Building } from '../../../shared/models/building.model';
import { BuildingService } from '../../../shared/services/building/building.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../core/components/input/input.component';
import { NestedInputComponent } from '../../../core/components/nested-input/nested-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service';

@Component({
  selector: 'app-add-edit-building',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    NestedInputComponent,
  ],
  templateUrl: './add-edit-building.component.html',
  styleUrls: ['./add-edit-building.component.scss'],
})
export class AddEditBuildingComponent implements OnInit {
  buildingForm: FormGroup;
  isEditMode: boolean = false;
  currentBuilding?: Building;

  allwatchmen!: any[];
  shifts: string[] = ['Morning', 'Afternoon', 'Night']; // Example shifts

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private watchmenService: watchmenService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.buildingForm = this.fb.group({
      name: ['', Validators.required],
      wings: this.fb.array([]),
      location: this.fb.group({
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        state: ['', Validators.required],
        address: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    const buildingId = this.route.snapshot.paramMap.get('id');

    if (buildingId) {
      this.isEditMode = true;
      this.loadBuilding(buildingId);
    }
    this.loadwatchmen();
  }

  loadBuilding(buildingId: string): void {
    this.buildingService.getBuildingById(buildingId).subscribe((building) => {
      this.currentBuilding = building;
      this.buildingForm.patchValue(this.currentBuilding);

      if (this.currentBuilding.wings) {
        this.currentBuilding.wings.forEach((wing) => {
          this.addWing(); // Add a new wing form group for each existing wing
          const currentWingGroup = this.wings.at(
            this.wings.length - 1
          ) as FormGroup;
          currentWingGroup.patchValue({
            wingName: wing.wingName,
            numberOfFloors: wing.numberOfFloors,
            roomsPerFloor: wing.roomsPerFloor,
          });

          if (wing.watchmen) {
            wing.watchmen.forEach(() => {
              this.addwatchmen(currentWingGroup);
            });
            currentWingGroup.get('watchmen')?.patchValue(wing.watchmen);
          }
        });
      }
    });
  }

  loadwatchmen() {
    this.watchmenService.getWatchmen().subscribe((data) => {
      this.allwatchmen = data; // Assuming data is an array of watchmen objects
    });
  }

  createWingGroup(): FormGroup {
    return this.fb.group({
      wingName: ['', Validators.required],
      numberOfFloors: ['', Validators.required],
      roomsPerFloor: ['', Validators.required],
      watchmen: this.fb.array([]), // Initialized as an empty FormArray
    });
  }

  createwatchmenGroup(): FormGroup {
    return this.fb.group({
      watchmenId: ['', Validators.required],
      sift: ['', Validators.required],
    });
  }

  get wings(): FormArray {
    return this.buildingForm.get('wings') as FormArray;
  }

  addWing(): void {
    const wingGroup = this.fb.group({
      wingName: ['', Validators.required],
      numberOfFloors: [0, [Validators.required, Validators.min(1)]],
      roomsPerFloor: [0, [Validators.required, Validators.min(1)]],
      watchmen: this.fb.array([]), // Add nested watchmen form array
    });

    this.wings.push(wingGroup);
  }

  removeWing(index: number): void {
    this.wings.removeAt(index);
  }

  getWatchmen(wingIndex: number): FormArray {
    return this.wings.at(wingIndex).get('watchmen') as FormArray;
  }

  addwatchmen(wing: AbstractControl) {
    const wingGroup = wing as FormGroup;
    const watchmen = wingGroup.get('watchmen') as FormArray;
    watchmen.push(this.createwatchmenGroup());
  }

  removewatchmen(wingIndex: number, watchmenIndex: number): void {
    this.getWatchmen(wingIndex).removeAt(watchmenIndex);
  }

  onSubmit() {
    if (this.buildingForm.valid) {
      const formValue: Building = this.buildingForm.value;
      console.log(formValue);

      if (this.isEditMode) {
        this.buildingService
          .updateBuilding(this.currentBuilding!.buildingId, formValue)
          .then(() => {
            console.log('Building updated successfully');
            this.router.navigate([`building`]);
          });
      } else {
        this.buildingForm
          .get('buildingId')
          ?.setValue(this.buildingForm.get('name')?.value);
        this.buildingService.addBuilding(formValue).then(() => {
          console.log('Building added successfully');
          this.router.navigate([`building`]);
        });
      }
    }
  }

  onReset() {
    this.buildingForm.reset();
  }
}
