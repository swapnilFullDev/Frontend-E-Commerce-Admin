import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category } from './../../../core/models/category.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatError, MatFormField, MatHint, MatLabel, MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: "app-add-category",
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatError,
    MatHint,
    ReactiveFormsModule,
  ],
  templateUrl: "./add-category.html",
  styleUrl: "./add-category.css",
})
export class AddCategory {
  categoryService = inject(CategoryService);
  categoryForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;
  parentCategories: Category[] = []; // preload parent categories from API
  filteredParentCategories: any[] = []; // Filtered list shown in dropdown
  parentCategorySearch = "";

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategory>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.categoryForm = this.fb.group({
      name: [data?.name || "", Validators.required],
      icon: [data?.icon || "", Validators.required],
      parentId: [data?.parentId || null],
      status: [data?.status || "active", Validators.required],
      image: [data?.image || null],
    });

    if (data?.image) {
      this.imagePreview = data.image;
    }
    this.categoryService.getCategories(1, 10, "").subscribe({
      next: (catRes) => {
        this.parentCategories = catRes.categories;
      },
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.categoryForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  filterParentCategories() {
    const search = this.parentCategorySearch.toLowerCase().trim();
    this.filteredParentCategories = this.parentCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search)
    );
  }

  onSave(): void {
    if (this.categoryForm.invalid) return;
    this.isLoading = true;
    const formValue = this.categoryForm.value;
    this.categoryService.createCategory(formValue).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.dialogRef.close();
      },
    });
  }

}
