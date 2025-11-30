import { Component, OnInit, ViewChild } from "@angular/core";
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
  ],
  templateUrl: "./inventory.html",
  styleUrl: "./inventory.css",
})
export class Inventory {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory() {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe({
      next: (items: any) => {
        this.dataSource.data = items.data;
        this.dataSource.paginator = this.paginator;
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
      width: "600px",
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

  onRentToggleChange(invId: number, checked: boolean, type: string): void {
    console.log("Rent availability changed:", checked);

    // Example: call service method
    this.inventoryService.toggleInventoryItem(invId, type).subscribe({
      next: () => {
        this.snackBar.open(`Inventory ${type} updated`, "Close", {
          duration: 3000,
        });
        this.loadInventory();
      },
      error: () => {
        this.snackBar.open(`Failed to update inventory ${type}`, "Close", {
          duration: 3000,
        });
      },
    });
  }
}
