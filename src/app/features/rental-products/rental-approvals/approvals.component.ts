import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

import { Product } from '../../../core/models/product.interface';
import { RentalProductService } from '../../../core/services/rentalProduct.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from "../../../shared/utils/common.utils";
import { ProductViewModalComponent } from "../../../shared/components/product-view-modal/product-view-modal.component";

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
    private dialogRef: MatDialog,
    private rentalProductService: RentalProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rejectForm = this.fb.group({
      comments: ['']
    });
  }

  onReject(): void {
    this.isLoading = true;
    this.rentalProductService.rejectRentalProduct(this.data.inventoryMasterId, this.rejectForm.get('remark')?.value || '').subscribe({
      next: () => {
        this.dialogRef.closeAll();
        this.isLoading = false;
      },
      error: (error) => {
        // Handle error if needed
      }
    });
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
export class RentalApprovalsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'price', 'category', 'submittedDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);
  isLoading = true;
  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rentalProductService: RentalProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  private loadPendingProducts(): void {
    this.isLoading = true;
    this.rentalProductService.getPendingProducts(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.total;
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

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPendingProducts();
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
        message: `Are you sure you want to approve "${product.productName}" ?`,
        confirmText: 'Approve',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rentalProductService.approveRentalProduct(product.inventoryMasterId).subscribe({
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
        this.rentalProductService.rejectRentalProduct(product.id, result.comments).subscribe({
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
    let dialogRef = this.dialog.open(ProductViewModalComponent, {
      width: '80vw',
      maxWidth: '800px',
      height: '80vh',
      maxHeight: '700px',
      data: product
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => { if(result) this.loadPendingProducts(); },
      
    });
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
          this.rentalProductService.approveRentalProduct(product.id).subscribe();
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
          this.rentalProductService.rejectRentalProduct(product.id, result.comments).subscribe();
        });
        
        setTimeout(() => {
          this.loadPendingProducts();
          this.snackBar.open(`${selectedProducts.length} products rejected successfully`, 'Close', { duration: 3000 });
        }, 1000);
      }
    });
  }

  getVariantSizes = CommonUtils.getVariantSizes;
  getVariantColour = CommonUtils.getVariantColors;
  getVariantPrices = CommonUtils.getVariantPrices;

}