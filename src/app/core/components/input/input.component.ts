
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class InputComponent {
  @Input() formArrayControl!: any;
  @Input() nestedControl!: any;
  @Input() control!: string;
  @Input() id!: string;
  @Input() label!: string;
  @Input() inputType: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() errorMessage: string = 'This field is required.';

  constructor(private controlContainer: ControlContainer) {
    console.log(this.form?.controls)
  }

  // Getter to access the parent form group
  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get getFormArray(): FormArray {
    return this.form.get(this.formArrayControl) as FormArray;
  }

  get getFormArrayControl(): FormGroup {
    return this.getFormArray.at(this.nestedControl) as FormGroup;
  }

  get getFormGroup(): FormGroup {
    return this.form.get(this.nestedControl) as FormGroup
  }

}
