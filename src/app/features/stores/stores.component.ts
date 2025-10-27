import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { Store } from '../../core/models/store.interface';
import { StoreService } from '../../core/services/store.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddStore } from './add-store/add-store';

@Component({
  selector: "app-stores",
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
    LoadingComponent,
    MatSlideToggleModule
  ],
  templateUrl: './stores.html',
})
export class StoresComponent implements OnInit {
  displayedColumns: string[] = [
    // "id",
    "name",
    "location",
    "owner",
    "contact",
    "address",
    "status",
    "actions",
  ];
  dataSource = new MatTableDataSource<Store>();
  isLoading = true;
  // store = this.storeService.store;
  store = signal<any[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private storeService: StoreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const u = this.store();
      if (u) {
        this.dataSource.data = u;
      }
    });
  }

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
        this.snackBar.open("Error loading stores", "Close", { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  onStatusChange(id: number): void {
  console.log('Store ID:', id, 'Status:');

  // Example: call backend API to update status
  this.storeService.updateStoreStatus(id).subscribe({
    next: (res) => {
      console.log('Status updated successfully', res);
    },
    error: (err) => {
      console.error('Error updating status', err);
    },
  });
}

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openStoreModal(store?: Store): void {
    const dialogRef = this.dialog.open(AddStore, {
      width: "700px",
      data: store || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadStores();
        this.snackBar.open(
          store ? "Store updated successfully" : "Store created successfully",
          "Close",
          { duration: 3000 }
        );
      }
    });
  }

  deleteStore(store: Store): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Delete Store",
        message: `Are you sure you want to delete "${store.businessName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.storeService.deleteStore(store.id).subscribe({
          next: () => {
            this.loadStores();
             this.store.update((stores:any) => stores.filter((s:any) => s.id !== store.id));
            this.snackBar.open("Store deleted successfully", "Close", {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open("Error deleting store", "Close", {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}