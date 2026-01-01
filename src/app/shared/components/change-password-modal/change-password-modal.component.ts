import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './change-password-modal.component.html',
  styles: []
})
export class ChangePasswordModalComponent {
  changePasswordForm: FormGroup;
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const changePasswordData = {
        oldPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmPassword: this.changePasswordForm.value.confirmPassword
      };

      this.authService.changePassword(changePasswordData).subscribe({
        next: (response) => {
          this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Failed to change password. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}