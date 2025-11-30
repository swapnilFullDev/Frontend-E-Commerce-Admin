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
import { MatCheckbox } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-add-inventory",
  imports: [
    MatCheckbox,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
  ],
  templateUrl: "./add-inventory.html",
  styleUrl: "./add-inventory.css",
})
export class AddInventory implements OnInit {
  inventoryForm!: FormGroup;
  isEdit = false;
  statusOptions = ["Active", "Inactive"];
  categoryOptions = ["M", "W", "Kids"];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private dialogRef: MatDialogRef<AddInventory>,
    @Inject(MAT_DIALOG_DATA) public data: InventoryItem | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;


    // Create a multi-step friendly form structure: basicInfo, images (FormArray), sizes (FormArray)
    this.inventoryForm = this.fb.group({
      basicInfo: this.fb.group({
        productName: [
          this.data?.productName || "",
          [Validators.required, Validators.maxLength(100)],
        ],
        availableColour: [this.data?.availableColour || "", Validators.maxLength(100)],
        prices: [this.data?.prices || 0, [Validators.required, Validators.min(0)]],
        isReturnAcceptable: [this.data?.isReturnAcceptable || false],
        isAvailableOnRent: [this.data?.isAvailableOnRent || false],
        status: [this.data?.status || "Active", Validators.required],
        category: [this.data?.category || "M", Validators.required],
        availableOnline: [this.data?.availableOnline ?? true],
        fabricMaterial: [this.data?.fabricMaterial || "", Validators.maxLength(255)],
        comboDetails: [this.data?.comboDetails || ""],
        description: [this.data?.description || ""],
      }),
      images: this.fb.array([]),
      sizes: this.fb.array([]),
    });

    // Prepopulate images if provided (supports array or JSON string)
    const imagesRaw = (this.data as any)?.productImages;
    if (imagesRaw) {
      try {
        const imgs = Array.isArray(imagesRaw) ? imagesRaw : JSON.parse(imagesRaw);
        if (Array.isArray(imgs)) {
          imgs.forEach((it: any) => {
            if (typeof it === 'string') {
              this.images.push(this.fb.group({ url: it, fileName: '', preview: it }));
            } else if (it && it.url) {
              this.images.push(this.fb.group({ url: it.url, fileName: it.fileName || '', preview: it.url }));
            }
          });
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    // Prepopulate sizes if provided
    const sizesRaw = (this.data as any)?.sizes;
    if (sizesRaw && Array.isArray(sizesRaw)) {
      sizesRaw.forEach((s: any) => this.sizes.push(this.fb.group({ size: s.size, quantity: s.quantity })));
    }
  }

  // getters for convenience
  get images(): FormArray {
    return this.inventoryForm.get('images') as FormArray;
  }

  get sizes(): FormArray {
    return this.inventoryForm.get('sizes') as FormArray;
  }

  get basicInfo(): FormGroup {
    return this.inventoryForm.get('basicInfo') as FormGroup;
  }

  // File selection handling
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(
          this.fb.group({ url: '', fileName: file.name, file: file, preview: e.target.result })
        );
      };
      reader.readAsDataURL(file);
    });
    // reset input value so selecting same file again triggers change
    input.value = '';
  }

  addImageUrl(url: string) {
    if (!url) return;
    this.images.push(this.fb.group({ url, fileName: '', preview: url }));
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  // Sizes handling
  addSize() {
    this.sizes.push(this.fb.group({ size: '', quantity: 0 }));
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
  }

  // Finalize form and submit
  finishAndSubmit() {
    // Merge basicInfo + images + sizes into payload
    if (this.inventoryForm.invalid) return;
    const basic = this.inventoryForm.get('basicInfo')?.value || {};
    const imagesPayload = this.images.controls.map((c: any) => {
      const v: any = c.value;
      return { url: v.url || '', fileName: v.fileName || '', preview: v.preview || '' };
    });
    const sizesPayload = this.sizes.controls.map((c: any) => c.value);

    const payload = {
      ...basic,
      productImages: imagesPayload,
      sizes: sizesPayload,
    } as any;

    // call existing create/update paths but with new payload
    if (this.isEdit && this.data?.iD) {
      this.inventoryService.update(this.data.iD, payload).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: () => alert('Failed to update item'),
      });
    } else {
      this.inventoryService.create(payload).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: () => alert('Failed to create item'),
      });
    }
  }

  onSubmit() {
    if (this.inventoryForm.invalid) {
      return;
    }

    const inventoryData: InventoryItem = this.inventoryForm.value;

    if (this.isEdit && this.data?.iD) {
      this.inventoryService.update(this.data.iD, inventoryData).subscribe({
        next: () => this.dialogRef.close("saved"),
        error: () => alert("Failed to update item"),
      });
    } else {
      this.inventoryService.create(inventoryData).subscribe({
        next: () => this.dialogRef.close("saved"),
        error: () => alert("Failed to create item"),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
