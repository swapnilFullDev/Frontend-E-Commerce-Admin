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
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['superadmin@example.com', [Validators.required, Validators.email]],
      password: ['TempPass123', [Validators.required, Validators.minLength(6)]]
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
      
      // this.authService.login(this.loginForm.value).subscribe({
      //   next: (user) => {
      //     this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
      //     this.router.navigate(['/dashboard']);
      //     this.isLoading = false;
      //   },
      //   error: (error) => {
      //     this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
      //     this.isLoading = false;
      //   }
      // });

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
}