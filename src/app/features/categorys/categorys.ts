import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatPaginatorModule, MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { CategoryService } from "../../core/services/category.service";
import { Category } from "../../core/models/category.interface";
import { AddCategory } from "./add-category/add-category";

@Component({
  selector: "app-categorys",
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
    DatePipe
  ],
  templateUrl: "./categorys.html",
  styleUrl: "./categorys.css",
})
export class Categorys {
  displayedColumns: string[] = [
    'id',
    'name',
    'image',
    'icon',
    'status',
    'createdAt',
    'actions'
  ];
  dataSource = new MatTableDataSource<Category>([]);
  isLoading = true;
  categoryService = inject(CategoryService);
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  search = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories(this.currentPage,this.pageSize,this.search).subscribe({
      next:(catRes)=>{
        this.dataSource.data = catRes.categories;
        this.totalItems = catRes.pagination.total;    // for paginator length
        this.pageSize = catRes.pagination.limit;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open("Error loading categories", "Close", {
          duration: 3000,
        });
        this.isLoading = false;
      },
    })
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex || 1; // paginator starts from 0
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCategoryModal(category?: Category): void {
    const dialogRef = this.dialog.open(AddCategory, {
      disableClose: true,
      width: "600px",
      data: category || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
        this.snackBar.open(
          category
            ? "Category updated successfully"
            : "Category created successfully",
          "Close",
          { duration: 3000 }
        );
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "400px",
      data: {
        title: "Delete Product",
        message: `Are you sure you want to delete "${category.name}" ? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
            this.snackBar.open("Category deleted successfully", "Close", {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open(`Error deleting product ${error}`, "Close", {
              duration: 3000,
            });
          },
        });
      }
    });
  }
  editCategory(product: Category){

  }
}
