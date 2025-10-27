import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { StoresComponent } from "../stores.component";

@Component({
  selector: "app-store-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./add-store.html",
})
export class AddStore {
  storeForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StoresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null = null
  ) {
    this.storeForm = this.fb.group({
      name: [data?.businessName || "", Validators.required],
      location: [data?.businessAddress || "", Validators.required],
      owner: [data?.ownerName || "", Validators.required],
      contactPhone: [data?.businessPhoneNo || "", Validators.required],
      contactEmail: [
        data?.businessEmail || "",
        [Validators.required, Validators.email],
      ],
      address: [data?.businessAddress || "", Validators.required],
      city: [data?.businessAddress || "", Validators.required],
      state: [data?.businessAddress || "", Validators.required],
      zipCode: [data?.businessAddress || "", Validators.required],
      isActive: [data?.isVerified ?? true],
    });
  }

  onSave(): void {
    if (this.storeForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.isLoading = false;
      }, 1000);
    }
  }
}
