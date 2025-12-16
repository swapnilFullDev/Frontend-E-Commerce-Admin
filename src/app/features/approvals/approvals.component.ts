import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

import { Product } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/product.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: "./reject-modal.html"
})
export class RejectModalComponent {
  rejectForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog
  ) {
    this.rejectForm = this.fb.group({
      comments: ['']
    });
  }

  onReject(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.dialogRef.closeAll();
      this.isLoading = false;
    }, 1000);
  }
}

@Component({
  selector: 'app-approvals',
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
    MatCheckboxModule,
    LoadingComponent
  ],
  templateUrl: "./approvals.html"
})
export class ApprovalsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'price', 'category', 'submittedBy', 'submittedDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  private loadPendingProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.selection.clear();
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading pending products', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  approveProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Approve Product',
        message: `Are you sure you want to approve "${product.name}"?`,
        confirmText: 'Approve',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.approveProduct(product.id).subscribe({
          next: () => {
            this.loadPendingProducts();
            this.snackBar.open('Product approved successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error approving product', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  rejectProduct(product: Product): void {
    const dialogRef = this.dialog.open(RejectModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.rejectProduct(product.id, result.comments).subscribe({
          next: () => {
            this.loadPendingProducts();
            this.snackBar.open('Product rejected successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error rejecting product', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  viewProduct(product: Product): void {
    this.snackBar.open('Product details view would be implemented here', 'Close', { duration: 3000 });
  }

  bulkApprove(): void {
    const selectedProducts = this.selection.selected;
    if (selectedProducts.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Bulk Approve Products',
        message: `Are you sure you want to approve ${selectedProducts.length} selected products?`,
        confirmText: 'Approve All',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // In a real app, you would make a bulk approval API call
        selectedProducts.forEach(product => {
          this.productService.approveProduct(product.id).subscribe();
        });
        
        setTimeout(() => {
          this.loadPendingProducts();
          this.snackBar.open(`${selectedProducts.length} products approved successfully`, 'Close', { duration: 3000 });
        }, 1000);
      }
    });
  }

  bulkReject(): void {
    const selectedProducts = this.selection.selected;
    if (selectedProducts.length === 0) return;

    const dialogRef = this.dialog.open(RejectModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        selectedProducts.forEach(product => {
          this.productService.rejectProduct(product.id, result.comments).subscribe();
        });
        
        setTimeout(() => {
          this.loadPendingProducts();
          this.snackBar.open(`${selectedProducts.length} products rejected successfully`, 'Close', { duration: 3000 });
        }, 1000);
      }
    });
  }
}