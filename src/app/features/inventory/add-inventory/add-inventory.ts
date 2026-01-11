import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { InventoryItem } from "../../../core/models/inventory.interface";
import { InventoryService } from "../../../core/services/inventory.service";
import {
  MatError,
  MatFormField,
  MatLabel,
  MatOption,
  
  MatSelectModule,
} from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormValidationComponent } from "../../../shared/components/form-validation/form-validation.component";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-add-inventory",
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatCheckboxModule,
    FormValidationComponent,
  ],
  templateUrl: "./add-inventory.html",
  styleUrl: "./add-inventory.css",
})
export class AddInventory implements OnInit {
  inventoryForm!: FormGroup;
  isEdit = false;
  statusOptions = ["Active", "Inactive"];
  categoryOptions = ["Clothing", "Accessories", "Footwear"];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private dialogRef: MatDialogRef<AddInventory>,
    @Inject(MAT_DIALOG_DATA) public data: InventoryItem | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;


    this.inventoryForm = this.fb.group({
      productName: [
        this.data?.productName || "",
        [Validators.required, Validators.maxLength(100)],
      ],
      description: [this.data?.description || "", [Validators.required, Validators.maxLength(100)]],
      category: [this.data?.category || "Clothing", Validators.required],
      brand: [this.data?.brand || "", Validators.required],
      isReturnAcceptable: [Boolean(this.data?.isReturnAcceptable) || false],
      images: this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
      variants: this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
    });

    // Prepopulate images if provided

    const imagesRaw = (this.data as any)?.imageUrls;
    if (imagesRaw && Array.isArray(imagesRaw)) {
      imagesRaw.forEach((img: any) => {
        this.images.push(this.fb.group({ file: null, preview: img, url: img }));
      });
    }

    // Prepopulate variants if provided
    const variantsRaw = (this.data as any)?.variants;
    if (variantsRaw && Array.isArray(variantsRaw)) {
      variantsRaw.forEach((v: any) => this.variants.push(this.createVariantGroup(v)));
    }else{
      this.addVariant();
    }
  }

  // getters for convenience
  get images(): FormArray {
    return this.inventoryForm.get('images') as FormArray;
  }

  get variants(): FormArray {
    return this.inventoryForm.get('variants') as FormArray;
  }

  createVariantGroup(variant?: any): FormGroup {
    return this.fb.group({
      id: [variant?.variantId || null],
      size: [variant?.size || '', Validators.required],
      color: [variant?.color || '', Validators.required],
      qty: [variant?.qty || 0, [Validators.required, Validators.min(1)]],
      price: [variant?.price || 0, [Validators.required, Validators.min(1)]],
      rentalPrice: [variant?.rentalPrice || 0],
      advancePrice: [variant?.advancePrice || 0],
      minimumDaysRental: [variant?.minimumDaysRental || 0],
    });
  }

  // File selection handling
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file) => {
      if (this.images.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(
          this.fb.group({ file: file, preview: e.target.result, url: null })
        );
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeImage(index: number) {
    if (this.images.length > 1) {
      this.images.removeAt(index);
    }
  }

  // Variants handling
  addVariant() {
    if (this.variants.length < 10) {
      this.variants.push(this.createVariantGroup());
    }
  }

  removeVariant(index: number) {
    if (this.variants.length > 1) {
      this.variants.removeAt(index);
    }
  }

  get canAddImage(): boolean {
    return this.images.length < 5;
  }

  get canRemoveImage(): boolean {
    return this.images.length > 1;
  }

  get canAddVariant(): boolean {
    return this.variants.length < 10;
  }

  get canRemoveVariant(): boolean {
    return this.variants.length > 1;
  }

  // Finalize form and submit
  finishAndSubmit() {
    console.log(this.inventoryForm.value);
    if (this.inventoryForm.invalid) return;
    
    const formData = new FormData();
    
    // Add basic fields
    formData.append('productName', this.inventoryForm.get('productName')?.value || '');
    formData.append('description', this.inventoryForm.get('description')?.value || '');
    formData.append('category', this.inventoryForm.get('category')?.value || '');
    formData.append('brand', this.inventoryForm.get('brand')?.value || '');
    formData.append('isReturnAcceptable', this.inventoryForm.get('isReturnAcceptable')?.value || 'false');
    
    // Add images - both existing URLs and new files
    this.images.controls.forEach((control: any) => {
      const file = control.get('file')?.value;
      const url = control.get('url')?.value;
      
      if (file) {
        // New image file
        formData.append('images', file);
      } else if (url) {
        // Existing image URL
        formData.append('images', url);
      }
    });
    
    // Add variants
    this.variants.controls.forEach((control: any, index: number) => {
      const variant = control.value;
      if (variant.id) {
        formData.append(`variants[${index}][variantId]`, variant.id.toString());
      }
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][qty]`, variant.qty.toString());
      formData.append(`variants[${index}][price]`, variant.price.toString());
      formData.append(`variants[${index}][rentalPrice]`, variant.rentalPrice.toString());
      formData.append(`variants[${index}][advancePrice]`, variant.advancePrice.toString());
      formData.append(`variants[${index}][minimumDaysRental]`, variant.minimumDaysRental);
    });

    if (this.isEdit && this.data?.inventoryMasterId) {
      this.inventoryService.update(this.data.inventoryMasterId, formData).subscribe({
        next: () => this.dialogRef.close(`saved`),
        error: () => alert('Failed to update item'),
      });
    } else {
      this.inventoryService.create(formData).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: () => alert('Failed to create item'),
      });
    }
  }

  onSubmit() {
    this.finishAndSubmit();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
