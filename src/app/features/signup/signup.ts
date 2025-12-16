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
import { AuthService } from "../../core/services/auth.service";

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
  authService = inject(AuthService);
  isLoading = false;
  selectedFileName = "";
  selectedImageName = "";
  filePreview: string | any = null;
  fileType: "image" | "pdf" | "other" = "other";
  filePreviewShop: string | any = null;
  selectedBusinessDoc: File | null = null;
  selectedShopImage: File | null = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      owner_name: ["", Validators.required],
      businessName: ["", [Validators.required]],
      business_email: ["", [Validators.required]],
      business_phone_no: [
        "",
        [Validators.required],
      ],
      personal_phone_no: [
        "",
        [Validators.required],
      ],
      gst_number: [""],
      business_docs: ["", [Validators.required]],
      business_address: new FormGroup({
          street: new FormControl('',[Validators.required]),
          pincode: new FormControl(''),
          state: new FormControl(''),
          city: new FormControl(''),
      }),
      business_front_image: ["", [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFileName = file.name;
    this.selectedBusinessDoc = file;
    this.userForm.patchValue({ business_docs: file.name });
    this.userForm.get("business_docs")?.updateValueAndValidity();

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
      const blobUrl = URL.createObjectURL(file);
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
    this.selectedShopImage = file;
    this.userForm.patchValue({ business_front_image: file.name });
    this.userForm.get("business_front_image")?.updateValueAndValidity();

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewShop = this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );
      };
      reader.readAsDataURL(file);
    } else {
      this.filePreviewShop = null;
    }
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      const formData = new FormData();
      const formValue = this.userForm.value;
      
      // Add files
      if (this.selectedShopImage) {
        formData.append('frontImage', this.selectedShopImage);
      }
      if (this.selectedBusinessDoc) {
        formData.append('docs', this.selectedBusinessDoc);
      }
      
      // Add form fields with correct keys
      formData.append('businessName', formValue.businessName || '');
      formData.append('ownerName', formValue.owner_name || '');
      formData.append('businessEmail', formValue.business_email || '');
      formData.append('businessPhoneNo', formValue.business_phone_no || '');
      formData.append('personalPhoneNo', formValue.personal_phone_no || '');
      formData.append('gstNumber', formValue.gst_number || '');
      
      // Handle business address as JSON string
      const businessAddress = {
        city: formValue.business_address?.city || '',
        state: formValue.business_address?.state || '',
        street: formValue.business_address?.street || '',
        pincode: formValue.business_address?.pincode || ''
      };
      formData.append('businessAddress', JSON.stringify(businessAddress));
      
      this.authService.signUpStore(formData).subscribe((response: any) => {
        console.log(response);
        this.isLoading = false;
      }, error => {
        console.error(error);
        this.isLoading = false;
      });
    }
  }
}
