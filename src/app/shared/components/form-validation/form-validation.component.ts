import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-validation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-red-500 text-sm mt-1" *ngIf="control?.invalid && (control?.dirty || control?.touched)">
      <div *ngIf="control?.hasError('required')">{{ fieldName }} is required</div>
      <div *ngIf="control?.hasError('maxlength')">{{ fieldName }} is too long</div>
      <div *ngIf="control?.hasError('minlength')">{{ fieldName }} is too short</div>
      <div *ngIf="control?.hasError('min')">{{ fieldName }} must be greater than {{ control?.getError('min')?.min }}</div>
      <div *ngIf="control?.hasError('max')">{{ fieldName }} must be less than {{ control?.getError('max')?.max }}</div>
      <div *ngIf="control?.hasError('email')">Please enter a valid email</div>
    </div>
  `
})
export class FormValidationComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = 'Field';
}