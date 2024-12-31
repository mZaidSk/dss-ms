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

  // For document uploads
  selectedDocuments: { [key: string]: File } = {};
  documentPreviews: { [key: string]: string | ArrayBuffer | null } = {
    id: null,
    pccno: null,
    trainingcertificate: null,
  };

  constructor(
    private fb: FormBuilder,
    private watchmenService: watchmenService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.watchmenForm = this.fb.group({
      watchmenId: [''],
      firstName: ['Om', Validators.required],
      lastName: ['Thakur', Validators.required],
      dob: ['12/02/2023', Validators.required],
      phoneNumber: [
        '9521425214',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      aadharNumber: [
        '125425412541',
        [Validators.required, Validators.pattern(/^\d{12}$/)],
      ],
      gender: ['male', Validators.required],
      placeOfBirth: ['mumbai', Validators.required],
      guards_qualification: ['12', Validators.required],

      role: ['guard', Validators.required],
      password: ['12345678', Validators.required],

      address: ['chembur', [Validators.required]],
      city: ['mumbai', Validators.required],
      state: ['maharastra', Validators.required],
      pincode: ['542254', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      district: ['mumbai', Validators.required],

      photoURL: [''],
      documents: this.fb.group({
        id: [null],
        pccno: [null],
        trainingcertificate: [null],
      }),

      attendance: [[]],

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
      console.log(this.currentwatchmen);

      if (this.currentwatchmen?.documents) {
        this.watchmenForm.get('documents')?.patchValue({
          id: this.currentwatchmen.documents.id || null,
          pccno: this.currentwatchmen.documents.pccno || null,
          trainingcertificate:
            this.currentwatchmen.documents.trainingcertificate || null,
        });

        this.documentPreviews['id'] = this.currentwatchmen.documents.id || null;
        this.documentPreviews['pccno'] =
          this.currentwatchmen.documents.pccno || null;
        this.documentPreviews['trainingcertificate'] =
          this.currentwatchmen.documents.trainingcertificate || null;
      }

      if (this.currentwatchmen.photoURL) {
        this.photoPreview = this.currentwatchmen.photoURL;
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhotoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }

  onDocumentSelected(event: Event, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedDocuments[docType] = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.documentPreviews[docType] = reader.result;
      };
      reader.readAsDataURL(this.selectedDocuments[docType]);
    }
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.selectedPhotoFile = undefined;
  }

  clearDocument(docType: string): void {
    this.documentPreviews[docType] = null;
    delete this.selectedDocuments[docType];
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.watchmenForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onSubmit() {
    console.log(this.watchmenForm.value);
    console.log(this.findInvalidControls());
    if (this.watchmenForm.valid) {
      const formValue: watchmen = this.watchmenForm.value;

      // Map selected documents to the expected structure
      formValue.documents = {
        id: this.selectedDocuments['id']?.name || undefined,
        pccno: this.selectedDocuments['pccno']?.name || undefined,
        trainingcertificate:
          this.selectedDocuments['trainingcertificate']?.name || undefined,
      };

      if (this.isEditMode) {
        formValue.updatedAt = new Date();
        this.watchmenService
          .updatewatchmen(
            this.currentwatchmen!.watchmenId!,
            formValue,
            this.selectedPhotoFile,
            this.selectedDocuments
          )
          .subscribe({
            next: () => {
              console.log('Watchmen updated successfully');
              this.router.navigate(['watchmen']);
            },
            error: (err) => console.error('Error updating watchmen:', err),
          });
      } else {
        formValue.createdAt = new Date();
        this.watchmenService
          .addwatchmen(
            formValue,
            this.selectedPhotoFile,
            this.selectedDocuments
          )
          .subscribe({
            next: () => {
              console.log('Watchmen added successfully');
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
    this.selectedDocuments = {};
    this.documentPreviews = {
      id: null,
      pccno: null,
      trainingcertificate: null,
    };
  }
}
