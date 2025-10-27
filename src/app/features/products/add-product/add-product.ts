import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ProductsComponent } from "../products.component";
import { Product, ProductCategory } from "../../../core/models/product.interface";

@Component({
  selector: "app-product-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: "./add-product.html",
})
export class AddProduct {
  productForm: FormGroup;
  isLoading = false;
  imagePreview: string | null = null;
  categories: ProductCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null = null
  ) {
    this.productForm = this.fb.group({
      name: [data?.name || "", Validators.required],
      price: [data?.price || "", [Validators.required, Validators.min(0.01)]],
      category: [data?.category || "", Validators.required],
      stock: [data?.stock || 0, [Validators.required, Validators.min(0)]],
      description: [data?.description || ""],
      isApproved: [data?.isApproved ?? true],
    });

    // Mock categories - in real app, get from service
    this.categories = [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Clothing" },
      { id: 3, name: "Books" },
      { id: 4, name: "Home & Garden" },
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
