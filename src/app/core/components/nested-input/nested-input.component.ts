import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-nested-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './nested-input.component.html',
  styleUrl: './nested-input.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NestedInputComponent {
  @Input() formArrayControl!: any;
  @Input() nestedControl!: any;
  @Input() label!: string;
  @Input() control!: string;
  @Input() inputType: string = 'text'; // Default type
  @Input() id!: string;
  @Input() placeholder: string = '';
  @Input() errorMessage: string = 'This field is required.';

  constructor(private controlContainer: ControlContainer) {
    console.log(this.controlContainer.control)
  }

  // Getter to access the parent form group
  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
