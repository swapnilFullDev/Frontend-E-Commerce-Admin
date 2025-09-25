import { Component, inject, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./signup.html",
  styleUrl: "./signup.css",
})
export class Signup {
  userForm: FormGroup;
  sanitizer = inject(DomSanitizer);
  router = inject(Router);
  isLoading = false;
  selectedFileName = "";
  selectedImageName = "";
  filePreview: string | any = null;
  fileType: "image" | "pdf" | "other" = "other";
  filePreviewShop: string | any = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      business_name: ["", [Validators.required]],
      business_email: ["", [Validators.required]],
      business_phone: [
        "",
        [Validators.required],
      ],
      personal_phone: [
        "",
        [Validators.required],
      ],
      GST_Number: [""],
      business_documnet: ["", [Validators.required]],
      business_address: new FormGroup({
          full_address: new FormControl('',[Validators.required]),
          pin_code: new FormControl(''),
          state: new FormControl(''),
          city: new FormControl(''),
      })
      ,
      shop_image: ["", [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFileName = file.name;
    this.userForm.patchValue({ business_documnet: file });
    this.userForm.get("business_documnet")?.updateValueAndValidity();

    if (file.type.startsWith("image/")) {
      this.fileType = "image";
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      this.fileType = "pdf";
      const reader = new FileReader();
      const blobUrl = URL.createObjectURL(file);
      console.log(this.filePreview);
      this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    } else {
      this.fileType = "other";
      this.filePreview = null;
    }
  }

  onFileSelectedShop(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImageName = file.name;
    this.userForm.patchValue({ shop_image: file });
    this.userForm.get("shop_image")?.updateValueAndValidity();

    if (file.type.startsWith("image/")) {
      this.fileType = "image";
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewShop = this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );
      };
      reader.readAsDataURL(file);
    } else {
      this.fileType = "other";
      this.filePreviewShop = null;
    }
  }
  onSave(): void {
    console.log(this.userForm.value);
    
    if (this.userForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }
}
