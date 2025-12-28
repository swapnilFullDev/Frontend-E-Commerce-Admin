import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../core/models/product.interface';
import { RentalProductService } from '../../../core/services/rentalProduct.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CommonUtils } from '../../../shared/utils/common.utils';
import { RejectViewModalComponent } from '../../../shared/components/reject-view-modal/reject-view-modal.component';

@Component({
  selector: 'app-rental-reject',
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
  templateUrl: './online-reject.html',
  styleUrl: './online-reject.css'
})
export class OnlineReject {
  displayedColumns: string[] = ['name', 'remark', 'actions'];
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
  ) { }

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  private loadPendingProducts(): void {
    this.isLoading = true;
    this.rentalProductService.getRentalRejectProducts(this.currentPage + 1, this.pageSize).subscribe({
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

  getVariantSizes = CommonUtils.getVariantSizes;
  getVariantColour = CommonUtils.getVariantColors;
  getVariantPrices = CommonUtils.getVariantPrices;

  viewRemark(product: any): void {
    this.dialog.open(RejectViewModalComponent, {
      width: '400px',
      data: { remark: product.remark }
    });
  }
}
