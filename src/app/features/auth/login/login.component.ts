import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
    RouterLink
  ],
  templateUrl: "./login.html"
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  showForgotPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['superAdmin@attirebandhan.com', [Validators.required, Validators.email]],
      password: ['Admin@123', [Validators.required, Validators.minLength(6)]]
    });
    
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      console.log(this.loginForm.value);
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (user) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      })
    }
  }

  toggleForgotPassword(): void {
    this.showForgotPassword = !this.showForgotPassword;
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      // Add forgot password API call here
      this.authService.forgetPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          console.log('Forgot password response:', response);
          this.snackBar.open('Password reset link sent to your email!', 'Close', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error sending password reset link. Please try again.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
      // this.snackBar.open('Password reset link sent to your email!', 'Close', { duration: 3000 });
      // this.isLoading = false;
    }
  }
}