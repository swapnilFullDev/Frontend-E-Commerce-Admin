import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { User } from '../../core/models/user.interface';
import { UserService } from '../../core/services/user.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: "./users.html"
})
export class UserModalComponent {
  userForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserModalComponent>,
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
      // In a real app, you would call the service here
      setTimeout(() => {
        this.dialogRef.close();
        this.isLoading = false;
      }, 1000);
    }
  }
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
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
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p class="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button 
          mat-raised-button 
          color="primary" 
          class="flex items-center gap-2"
          (click)="openUserModal()">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-6">
          <!-- Search -->
          <div class="mb-4">
            <mat-form-field  class="w-full max-w-md">
              <mat-label>Search users</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <!-- Loading -->
          <app-loading *ngIf="isLoading"></app-loading>

          <!-- Table -->
          <div class="overflow-x-auto" *ngIf="!isLoading">
            <table mat-table [dataSource]="dataSource" matSort class="w-full">
              
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> ID </th>
                <td mat-cell *matCellDef="let user"> {{ user.id }} </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Name </th>
                <td mat-cell *matCellDef="let user"> {{ user.name }} </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Email </th>
                <td mat-cell *matCellDef="let user"> {{ user.email }} </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Role </th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set>
                    <mat-chip [color]="getRoleColor(user.role)" selected>{{ user.role }}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Status </th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip-set>
                    <mat-chip [color]="user.isActive ? 'accent' : 'warn'" selected>
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Created </th>
                <td mat-cell *matCellDef="let user"> {{ user.createdAt | date:'shortDate' }} </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Actions </th>
                <td mat-cell *matCellDef="let user">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="openUserModal(user)"
                    matTooltip="Edit user">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteUser(user)"
                    matTooltip="Delete user">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
            </table>

            <mat-paginator 
              [pageSizeOptions]="[5, 10, 20]" 
              showFirstLastButtons
              class="mt-4">
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User>();
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
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
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
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}