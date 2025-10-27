import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/models/user.interface';
import { UsersComponent } from '../users.component';

@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {
  userForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null = null
  ) {
    this.userForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      role: [data?.role || '', Validators.required],
      isActive: [data?.isActive ?? true]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.isLoading = false;
      }, 1000);
    }
  }
}
