import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { NgOptimizedImage } from '@angular/common';
import { CommonUtils } from '../../utils/common.utils';
import { Product } from '../../../core/models/product.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule
  ],
  templateUrl: './product-view-modal.component.html',
  styleUrl: './product-view-modal.component.css'
})
export class ProductViewModalComponent {
  variantColumns = ['size', 'color', 'qty', 'price', 'rentalPrice', 'advancePrice', 'minRental'];

  constructor(
    public dialogRef: MatDialogRef<ProductViewModalComponent>,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formatCurrency = CommonUtils.formatCurrency;

  // approveProduct(product: Product = this.data): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '400px',
  //     disableClose: true,
  //     data: {
  //       title: 'Approve Product',
  //       message: `Are you sure you want to approve "${product.productName}" ?`,
  //       confirmText: 'Approve',
  //       cancelText: 'Cancel'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.productService.approveProduct(product.inventoryMasterId).subscribe({
  //         next: () => {
  //           this.snackBar.open('Product approved successfully', 'Close', { duration: 3000 });
  //           this.close();
  //         },
  //         error: (error) => {
  //           this.snackBar.open('Error approving product', 'Close', { duration: 3000 });
  //         }
  //       });
  //     }
  //   });
  // }

  // close(): void {
  //   this.dialogRef.close();
  // }
}