import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { FormValidationComponent } from "../../../shared/components/form-validation/form-validation.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    FormValidationComponent
],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log(this.token);
    if (!this.token) {
      this.snackBar.open('Invalid reset link', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.resetForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const resetData = {
        token: this.token,
        newPassword: this.resetForm.value.password,
        confirmPassword: this.resetForm.value.confirmPassword
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          this.snackBar.open('Password reset successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Password reset failed. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}