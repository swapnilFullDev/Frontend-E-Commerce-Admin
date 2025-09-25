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
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Product, ProductCategory } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/product.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-modal',
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
  templateUrl: "./products.html"
})
export class ProductModalComponent {
  productForm: FormGroup;
  isLoading = false;
  imagePreview: string | null = null;
  categories: ProductCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null = null
  ) {
    this.productForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      price: [data?.price || '', [Validators.required, Validators.min(0.01)]],
      category: [data?.category || '', Validators.required],
      stock: [data?.stock || 0, [Validators.required, Validators.min(0)]],
      description: [data?.description || ''],
      isApproved: [data?.isApproved ?? true]
    });

    // Mock categories - in real app, get from service
    this.categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Books' },
      { id: 4, name: 'Home & Garden' }
    ];
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.isLoading = false;
      }, 1000);
    }
  }
}

@Component({
  selector: 'app-products',
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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
          <p class="text-gray-600">Manage your product catalog</p>
        </div>
        <button 
          mat-raised-button 
          color="primary" 
          class="flex items-center gap-2"
          (click)="openProductModal()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-6">
          <!-- Search -->
          <div class="mb-4">
            <mat-form-field  class="w-full max-w-md">
              <mat-label>Search products</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or category">
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
                <td mat-cell *matCellDef="let product"> {{ product.id }} </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Name </th>
                <td mat-cell *matCellDef="let product"> {{ product.name }} </td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Price </th>
                <td mat-cell *matCellDef="let product"> \${{ product.price | number:'1.2-2' }} </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Category </th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip-set>
                    <mat-chip color="primary" selected>{{ product.category }}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Stock </th>
                <td mat-cell *matCellDef="let product">
                  <span [class]="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ product.stock }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Status </th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip-set>
                    <mat-chip [color]="product.isApproved ? 'accent' : 'warn'" selected>
                      {{ product.isApproved ? 'Approved' : 'Pending' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Actions </th>
                <td mat-cell *matCellDef="let product">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="openProductModal(product)"
                    matTooltip="Edit product">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteProduct(product)"
                    matTooltip="Delete product">
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
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openProductModal(product?: Product): void {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '600px',
      data: product || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.snackBar.open(product ? 'Product updated successfully' : 'Product created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}