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
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './view-user.html',
})
export class ViewUser {
  userForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null = null
  ) {
    this.userForm = this.fb.group({
      name: [{ value: data?.name || '', disabled: true }],
      email: [{ value: data?.email || '', disabled: true }],
      role: [{ value: data?.role || '', disabled: true }],
      isActive: [{ value: data?.isActive ?? true, disabled: true }]
    });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', user: this.data });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
