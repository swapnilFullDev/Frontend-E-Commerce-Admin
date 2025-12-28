import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { InventoryService } from "../../core/services/inventory.service";
import { InventoryItem } from "../../core/models/inventory.interface";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddInventory } from "../inventory/add-inventory/add-inventory";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { NgOptimizedImage } from '@angular/common'
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from "@angular/material/select";
import { CommonUtils } from "../../shared/utils/common.utils";
import { Router } from "@angular/router";

@Component({
  selector: "app-inventory",
  imports: [
    CommonModule,
    NgOptimizedImage,
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
    MatSelectModule
  ],
  templateUrl: "./inventory.html",
  styleUrl: "./inventory.css",
})
export class Inventory implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "productImages",
    "productName",
    "availableSizes",
    "availableColour",
    "prices",
    "isReturnAcceptable",
    "isAvailableOnRent",
    "status",
    "category",
    "availableOnline",
    "actions",
  ];
  dataSource = new MatTableDataSource<InventoryItem>([]);
  isLoading = false;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  ngOnDestroy(): void {
    // Clear data when leaving component
    this.dataSource.data = [];
  }

  loadInventory() {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe({
      next: (response: any) => {
        // Pre-compute status values to avoid function calls in template
        this.dataSource.data = response.data.map((item: any) => ({
          ...item,
          rentStatus: this.computeRentStatus(item),
          onlineStatus: this.computeOnlineStatus(item)
        }));
        this.totalItems = response.total;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open("Failed to load inventory items", "Close", {
          duration: 3000,
        });
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(item?: InventoryItem) {
    const dialogRef = this.dialog.open(AddInventory, {
      width: "700px",
      height: "625px",
      maxHeight: "100%",
      data: item ? { ...item } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "saved") {
        this.loadInventory();
      }
    });
  }

  deleteItem(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: { message: `Delete product "${item.product_name}"?` },
    });
    console.log(item);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.inventoryService.delete(item.id).subscribe({
          next: () => {
            this.snackBar.open("Inventory item deleted", "Close", {
              duration: 3000,
            });
            this.loadInventory();
          },
          error: () => {
            this.snackBar.open("Failed to delete inventory item", "Close", {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  onRentToggleChange(invId: number, productName: string): void {
    this.inventoryService.toggleInventoryAvailableRental(invId).subscribe({
      next: () => {
        this.snackBar.open(`Inventory ${productName} requested for available rental online`, "Close", {
          duration: 3000,
        });
        this.loadInventory();
      },
      error: () => {
        this.snackBar.open(`Failed to request inventory ${productName}`, "Close", {
          duration: 3000,
        });
      },
    });
  }

  onOnlineToggleChange(invId: number, productName:string): void {
    this.inventoryService.toggleInventoryAvailableOnline(invId).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open(`Inventory ${productName} requested to be available online listing`, "Close", {
          duration: 3000,
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.loadInventory();
        });
      },
      error: () => {
        this.snackBar.open(`Failed to request inventory ${productName} for online lisitng`, "Close", {
          duration: 3000,
        });
      },
    });
  }

  onStatusToggleChange(invId: number, checked: boolean, type: string): void {
    this.inventoryService.toggleInventoryItem(invId, type).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open(`Inventory ${type} updated`, "Close", {
          duration: 3000,
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.loadInventory();
        });
      },
      error: () => {
        this.snackBar.open(`Failed to update inventory ${type}`, "Close", {
          duration: 3000,
        });
      },
    });
  }

  getVariantSizes = CommonUtils.getVariantSizes;
  getVariantColour = CommonUtils.getVariantColors;
  getVariantPrices = CommonUtils.getVariantPrices;

  private computeRentStatus(element: any): string {
    if (element.isRentalAvailable == false && element.isVerifyRentalAvailable == false) {
      return 'Request';
    } else if (element.isRentalAvailable == true && element.isVerifyRentalAvailable == false && element.isReject == false) {
      return 'Pending';
    } else if(element.isRentalAvailable == true && element.isReject == true){
      return 'Rejected';
    } else {
      return 'Approved';
    }
  }

  private computeOnlineStatus(element: any): string {
    if (element.isOnlineAvailable == false && element.isVerifyOnlineAvailable == false) {
      return 'Request';
    } else if (element.isOnlineAvailable == true && element.isVerifyOnlineAvailable == false && element.isReject == false) {
      return 'Pending';
    } else if(element.isOnlineAvailable == true && element.isReject == true){
      return 'Rejected';
    } else {
      return 'Approved';
    }
  }

}
