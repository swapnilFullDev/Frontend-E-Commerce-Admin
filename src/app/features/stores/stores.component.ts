import { Component, effect, OnInit, AfterViewInit, signal, ViewChild } from '@angular/core';
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
import { ViewStore } from './view-store/view-store';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  templateUrl: './stores.html',
})
export class StoresComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "name",
    "location",
    "owner",
    "contact",
    "address",
    "status",
    "actions",
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;
  store = signal<any[]>([]);
  
  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';
  isVerified = "";
  checkboxState = 0; // 0: unchecked, 1: checked, 2: indeterminate
  
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

  ngAfterViewInit(): void {
    // Paginator is now handled by (page) event in template
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex || 1;
    this.pageSize = event.pageSize;
    this.loadStores();
  }

  private loadStores(): void {
    this.isLoading = true;
    this.storeService.getStores(this.currentPage, this.pageSize, this.searchTerm,this.isVerified).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataSource.data = response.data;
        
        // Update pagination info from API response
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.pageSize = response.limit;
        
        // Disable client-side pagination since we're using server-side
        this.dataSource.paginator = null;
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

  isVerifiedToggle(){
    this.checkboxState = (this.checkboxState + 1) % 3;
    
    switch(this.checkboxState) {
      case 0: // unchecked - show all
        this.isVerified = "";
        break;
      case 1: // checked - show verified only
        this.isVerified = "true";
        break;
      case 2: // indeterminate - show unverified only
        this.isVerified = "false";
        break;
    }
    
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadStores();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.isVerified = '';
    this.checkboxState = 0;
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    // Clear search input
    const searchInput = document.querySelector('input[matInput]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    this.loadStores();
  }

  get isCheckboxChecked(): boolean {
    return this.checkboxState === 1;
  }

  get isCheckboxIndeterminate(): boolean {
    return this.checkboxState === 2;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim();
    this.currentPage = 1; // Reset to first page when searching
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadStores();
  }

  openStoreModal(store?: Store): void {
    const dialogRef = this.dialog.open(ViewStore, {
      autoFocus: false,
      disableClose: true,
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
      disableClose: true,
      data: {
        title: "Delete Store",
        message: `Are you sure you want to delete "${store.businessName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.storeService.deleteStore(store.businessId).subscribe({
          next: () => {
            this.loadStores();
            this.store.update((stores:any) => stores.filter((s:any) => s.businessId !== store.businessId));
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