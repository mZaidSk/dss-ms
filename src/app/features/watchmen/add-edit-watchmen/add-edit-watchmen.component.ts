import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service';
import { watchmen } from '../../../shared/models/watchmen.model';
import { InputComponent } from '../../../core/components/input/input.component';

@Component({
  selector: 'app-add-edit-watchmen',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './add-edit-watchmen.component.html',
  styleUrls: ['./add-edit-watchmen.component.scss'],
})
export class AddEditwatchmenComponent implements OnInit {
  watchmenForm: FormGroup;
  isEditMode: boolean = false;
  currentwatchmen?: watchmen;
  selectedPhotoFile?: File;
  photoPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private watchmenService: watchmenService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.watchmenForm = this.fb.group({
      watchmenId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      address: ['', [Validators.required]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      createdAt: [''],
      updatedAt: [''],
    });
  }

  ngOnInit(): void {
    const watchmenId = this.route.snapshot.paramMap.get('id');
    if (watchmenId) {
      this.isEditMode = true;
      this.loadwatchmen(watchmenId);
    }
  }

  loadwatchmen(watchmenId: string): void {
    this.watchmenService.getwatchmenById(watchmenId).subscribe((watchmen) => {
      this.currentwatchmen = watchmen;
      this.watchmenForm.patchValue(this.currentwatchmen);
      // If there is an existing photo, set the preview
      if (this.currentwatchmen.photoURL) {
        this.photoPreview = this.currentwatchmen.photoURL;
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhotoFile = input.files[0];

      // Show the photo preview
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.selectedPhotoFile = undefined;
  }

  onSubmit() {
    if (this.watchmenForm.valid) {
      const formValue: watchmen = this.watchmenForm.value;
      if (this.isEditMode) {
        formValue.updatedAt = new Date();
        this.watchmenService
          .updatewatchmen(
            this.currentwatchmen!.watchmenId!,
            formValue,
            this.selectedPhotoFile
          )
          .subscribe({
            next: () => {
              console.log('watchmen updated successfully');
              this.router.navigate(['watchmen']);
            },
            error: (err) => console.error('Error updating watchmen:', err),
          });
      } else {
        formValue.createdAt = new Date();
        this.watchmenService
          .addwatchmen(formValue, this.selectedPhotoFile)
          .subscribe({
            next: () => {
              console.log('watchmen added successfully');
              this.router.navigate(['watchmen']);
            },
            error: (err) => console.error('Error adding watchmen:', err),
          });
      }
    }
  }

  onReset() {
    this.watchmenForm.reset();
    this.selectedPhotoFile = undefined;
    this.photoPreview = null;
  }
}
