import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { User } from '../../core/models/user.interface';
import { UserService } from '../../core/services/user.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ViewUser } from './view-user/view-user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    LoadingComponent
  ],
  templateUrl: './users.html' 
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['userImage','name', 'email', 'gender', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User|any>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoleColor(role: string): 'primary' | 'accent' | 'warn' {
    switch (role) {
      case 'Admin': return 'warn';
      case 'Manager': return 'primary';
      default: return 'accent';
    }
  }

  openUserModal(user?: User): void {
    const dialogRef = this.dialog.open(ViewUser, {
      width: '500px',
      disableClose: true,
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.snackBar.open(user ? 'User updated successfully' : 'User created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        permanentDelete: 'Permanent Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "Permanent") {
        this.userService.permanentDeleteUser(user.userId).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('User permanent deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Error permanent deleting user', 'Close', { duration: 3000 });
          }
        });
      }else{
        console.log(result);
        
        this.userService.softDeleteUser(user.userId).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('User soft deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Error soft deleting user', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}