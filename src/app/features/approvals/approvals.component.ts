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
  templateUrl: "./approvals.html"
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
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Product Approvals</h1>
          <p class="text-gray-600">Review and approve pending products</p>
        </div>
        <div class="flex gap-2" *ngIf="selection.hasValue()">
          <button 
            mat-raised-button 
            color="primary" 
            (click)="bulkApprove()"
            class="flex items-center gap-2">
            <mat-icon>check</mat-icon>
            Approve Selected ({{ selection.selected.length }})
          </button>
          <button 
            mat-raised-button 
            color="warn" 
            (click)="bulkReject()"
            class="flex items-center gap-2">
            <mat-icon>close</mat-icon>
            Reject Selected ({{ selection.selected.length }})
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-content class="p-6">
          <!-- Search -->
          <div class="mb-4">
            <mat-form-field  class="w-full max-w-md">
              <mat-label>Search pending products</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or submitted by">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <!-- Loading -->
          <app-loading *ngIf="isLoading"></app-loading>

          <!-- Table -->
          <div class="overflow-x-auto" *ngIf="!isLoading">
            <table mat-table [dataSource]="dataSource" matSort class="w-full">
              
              <ng-container matColumnDef="select">
                <th mat-header-cell *matHeaderCellDef>
                  <mat-checkbox (change)="$event ? masterToggle() : null"
                               [checked]="selection.hasValue() && isAllSelected()"
                               [indeterminate]="selection.hasValue() && !isAllSelected()">
                  </mat-checkbox>
                </th>
                <td mat-cell *matCellDef="let product">
                  <mat-checkbox (click)="$event.stopPropagation()"
                               (change)="$event ? selection.toggle(product) : null"
                               [checked]="selection.isSelected(product)">
                  </mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> ID </th>
                <td mat-cell *matCellDef="let product"> {{ product.id }} </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Product Name </th>
                <td mat-cell *matCellDef="let product"> {{ product.name }} </td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Price </th>
                <td mat-cell *matCellDef="let product"> \${{ product.price | number:'1.2-2' }} </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Category </th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip-set>
                    <mat-chip color="primary" selected>{{ product.category }}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="submittedBy">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Submitted By </th>
                <td mat-cell *matCellDef="let product"> {{ product.submittedBy || 'Unknown' }} </td>
              </ng-container>

              <ng-container matColumnDef="submittedDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Date </th>
                <td mat-cell *matCellDef="let product"> 
                  {{ product.submittedDate ? (product.submittedDate | date:'shortDate') : (product.createdAt | date:'shortDate') }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Status </th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip-set>
                    <mat-chip color="warn" selected>Pending</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Actions </th>
                <td mat-cell *matCellDef="let product">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="approveProduct(product)"
                    matTooltip="Approve product">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="rejectProduct(product)"
                    matTooltip="Reject product">
                    <mat-icon>cancel</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="viewProduct(product)"
                    matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
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

            <div *ngIf="dataSource.data.length === 0" class="text-center py-8 text-gray-500">
              <mat-icon class="text-6xl mb-4">inventory</mat-icon>
              <p class="text-lg">No pending products to review</p>
              <p>All products have been approved or rejected</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
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
        // Filter only non-approved products
        const pendingProducts = products.filter((p:any) => !p.isApproved);
        this.dataSource.data = pendingProducts;
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