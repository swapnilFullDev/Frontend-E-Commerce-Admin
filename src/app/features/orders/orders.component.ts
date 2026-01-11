import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { Order } from '../../core/models/order.interface';
import { OrderService } from '../../core/services/order.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: "./orders.html"
})
export class OrderDetailModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public order: Order) {}

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Delivered': return 'accent';
      case 'Processing': case 'Shipped': return 'primary';
      case 'Cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getPaymentStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Paid': return 'accent';
      case 'Failed': case 'Refunded': return 'warn';
      default: return 'primary';
    }
  }
}

@Component({
  selector: 'app-orders',
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
    MatSelectModule,
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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p class="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      <mat-card>
        <mat-card-content class="p-6">
          <!-- Filters -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <mat-form-field  class="flex-1">
              <mat-label>Search orders</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by order ID or customer">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field  class="md:w-48">
              <mat-label>Filter by status</mat-label>
              <mat-select (selectionChange)="filterByStatus($event.value)">
                <mat-option value="">All Statuses</mat-option>
                <mat-option value="Pending">Pending</mat-option>
                <mat-option value="Processing">Processing</mat-option>
                <mat-option value="Shipped">Shipped</mat-option>
                <mat-option value="Delivered">Delivered</mat-option>
                <mat-option value="Cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Loading -->
          <app-loading *ngIf="isLoading"></app-loading>

          <!-- Table -->
          <div class="overflow-x-auto" *ngIf="!isLoading">
            <table mat-table [dataSource]="dataSource" matSort class="w-full">
              
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Order ID </th>
                <td mat-cell *matCellDef="let order"> #{{ order.id }} </td>
              </ng-container>

              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Customer </th>
                <td mat-cell *matCellDef="let order">
                  <div class="text-sm">
                    <div class="font-medium">{{ order.customerName }}</div>
                    <div class="text-gray-500">{{ order.customerEmail }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Total </th>
                <td mat-cell *matCellDef="let order">
                  <span class="font-medium">\${{ order.totalAmount | number:'1.2-2' }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="orderDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold"> Date </th>
                <td mat-cell *matCellDef="let order"> {{ order.orderDate | date:'shortDate' }} </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Status </th>
                <td mat-cell *matCellDef="let order">
                  <mat-chip-set>
                    <mat-chip [color]="getStatusColor(order.status)" selected>
                      {{ order.status }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="paymentStatus">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Payment </th>
                <td mat-cell *matCellDef="let order">
                  <mat-chip-set>
                    <mat-chip [color]="getPaymentStatusColor(order.paymentStatus)" selected>
                      {{ order.paymentStatus }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold"> Actions </th>
                <td mat-cell *matCellDef="let order">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="viewOrderDetails(order)"
                    matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="accent"
                    (click)="updateOrderStatus(order)"
                    matTooltip="Update status">
                    <mat-icon>edit</mat-icon>
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
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customer', 'totalAmount', 'orderDate', 'status', 'paymentStatus', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  isLoading = true;
  allOrders: Order[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.dataSource.data = orders;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    if (status === '') {
      this.dataSource.data = this.allOrders;
    } else {
      this.dataSource.data = this.allOrders.filter(order => order.status === status);
    }
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Delivered': return 'accent';
      case 'Processing': case 'Shipped': return 'primary';
      case 'Cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getPaymentStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Paid': return 'accent';
      case 'Failed': case 'Refunded': return 'warn';
      default: return 'primary';
    }
  }

  viewOrderDetails(order: Order): void {
    this.dialog.open(OrderDetailModalComponent, {
      width: '800px',
      disableClose: true,
      data: order
    });
  }

  updateOrderStatus(order: Order): void {
    // In a real app, this would open a status update modal
    this.snackBar.open('Status update feature would be implemented here', 'Close', { duration: 3000 });
  }
}