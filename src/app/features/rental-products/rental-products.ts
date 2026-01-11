import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    LoadingComponent,
    RouterOutlet
  ],
  templateUrl: './rental-products.html',
  styleUrl: './rental-products.css'
})
export class RentalProducts implements AfterViewInit {
  displayedColumns: string[] = ['name', 'price', 'category', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  isLoading = true;
  hasActiveChildRoute = false;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rentalProductService: RentalProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkActiveRouteAndLoad();
      });

    // Run once on initial load
    this.checkActiveRouteAndLoad();
  }

  private checkActiveRouteAndLoad(): void {
    const isProductsRoot = this.router.url === '/rental-products';

    this.hasActiveChildRoute = !isProductsRoot;

    if (isProductsRoot) {
      this.loadProducts();
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.currentPage = event.pageIndex || 1;
        this.pageSize = event.pageSize;
        this.loadProducts();
      });
    }
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.rentalProductService.getOnlineVerifiedProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || [];
        this.totalItems = response.pagination.totalItems;
        this.totalPages = response.pagination.totalPages;
        this.currentPage = response.pagination.currentPage;
        
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage - 1;
          this.paginator.pageSize = parseInt(response.itemsPerPage) || this.pageSize;
        }
        
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

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rentalProductService.deleteRentalProduct(product.id).subscribe({
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

  getProductPrices(variants: any[]): string {
    return variants?.map(v => `₹${v.price}`).join(', ') || '₹0';
  }

  getStockData(variants: any[]) {
    return variants?.map(v => `Size-${v.size} : ${v.qty} Qty`).join(', ');
  }
}
