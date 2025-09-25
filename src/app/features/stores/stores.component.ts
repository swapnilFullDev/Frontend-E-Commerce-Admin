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
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Store } from '../../core/models/store.interface';
import { StoreService } from '../../core/services/store.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-store-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: "./stores.html"
})

export class StoreModalComponent {
  storeForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StoreModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Store | null = null
  ) {
    this.storeForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      location: [data?.location || '', Validators.required],
      owner: [data?.owner || '', Validators.required],
      contactPhone: [data?.contactPhone || '', Validators.required],
      contactEmail: [data?.contactEmail || '', [Validators.required, Validators.email]],
      address: [data?.address || '', Validators.required],
      city: [data?.city || '', Validators.required],
      state: [data?.state || '', Validators.required],
      zipCode: [data?.zipCode || '', Validators.required],
      isActive: [data?.isActive ?? true]
    });
  }

  onSave(): void {
    if (this.storeForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.isLoading = false;
      }, 1000);
    }
  }
}

@Component({
  selector: 'app-stores',
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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Store Management</h1>
          <p class="text-gray-600">Manage store locations and information</p>
        </div>
        <button 
          mat-raised-button 
          color="primary" 
          class="flex items-center gap-2"
          (click)="openStoreModal()">
          <mat-icon>add</mat-icon>
          Add Store
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-6">
          <!-- Search -->
          <div class="mb-4">
            <mat-form-field  class="w-full max-w-md">
              <mat-label>Search stores</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or location">
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
                <td mat-cell *matCellDef="let store"> {{ store.id }} </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Store Name </th>
                <td mat-cell *matCellDef="let store"> {{ store.name }} </td>
              </ng-container>

              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Location </th>
                <td mat-cell *matCellDef="let store"> {{ store.location }} </td>
              </ng-container>

              <ng-container matColumnDef="owner">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Owner </th>
                <td mat-cell *matCellDef="let store"> {{ store.owner }} </td>
              </ng-container>

              <ng-container matColumnDef="contact">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Contact </th>
                <td mat-cell *matCellDef="let store">
                  <div class="text-sm">
                    <div>{{ store.contactPhone }}</div>
                    <div class="text-gray-500">{{ store.contactEmail }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Address </th>
                <td mat-cell *matCellDef="let store">
                  <div class="text-sm">
                    <div>{{ store.address }}</div>
                    <div class="text-gray-500">{{ store.city }}, {{ store.state }} {{ store.zipCode }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Status </th>
                <td mat-cell *matCellDef="let store">
                  <mat-chip-set>
                    <mat-chip [color]="store.isActive ? 'accent' : 'warn'" selected>
                      {{ store.isActive ? 'Active' : 'Inactive' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Actions </th>
                <td mat-cell *matCellDef="let store">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="openStoreModal(store)"
                    matTooltip="Edit store">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteStore(store)"
                    matTooltip="Delete store">
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
export class StoresComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'location', 'owner', 'contact', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<Store>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private storeService: StoreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.isLoading = true;
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.dataSource.data = stores;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading stores', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openStoreModal(store?: Store): void {
    const dialogRef = this.dialog.open(StoreModalComponent, {
      width: '700px',
      data: store || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStores();
        this.snackBar.open(store ? 'Store updated successfully' : 'Store created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteStore(store: Store): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Store',
        message: `Are you sure you want to delete "${store.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storeService.deleteStore(store.id).subscribe({
          next: () => {
            this.loadStores();
            this.snackBar.open('Store deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error deleting store', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}