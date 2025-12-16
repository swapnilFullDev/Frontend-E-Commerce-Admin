import { Component, OnInit, ViewChild } from '@angular/core';
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

import { Product } from '../../core/models/product.interface';
import { RentalProductService } from '../../core/services/rentalProduct.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
// import { AddRentalProducts } from './add-rental-products/add-rental-products';

@Component({
  selector: 'app-rental-products',
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
  templateUrl: './rental-products.html',
  styleUrl: './rental-products.css'
})
export class RentalProducts {
  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rentalProductService: RentalProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.rentalProductService.getRentalProducts().subscribe({
      next: (rentalProducts) => {
        console.log(rentalProducts);
        this.dataSource.data = rentalProducts;
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

  // openProductModal(product?: Product): void {
  //   const dialogRef = this.dialog.open(AddRentalProducts, {
  //     width: '600px',
  //     data: product || null
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.loadProducts();
  //       this.snackBar.open(product ? 'Rental product updated successfully' : 'Rental product created successfully', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

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
        this.rentalProductService.deleteProduct(product.id).subscribe({
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
