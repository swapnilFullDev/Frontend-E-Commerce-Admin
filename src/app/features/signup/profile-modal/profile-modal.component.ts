import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile-modal.html',
  styles: []
})
export class ProfileModalComponent {
  userForm: FormGroup;
  sanitizer = inject(DomSanitizer);
  authService = inject(AuthService);
  isLoading = false;
  selectedFileName = "";
  selectedImageName = "";
  selectedBusinessDoc: File | null = null;
  selectedShopImage: File | null = null;
  businessDocUrl = "";
  shopImageUrl = "";
  filePreview: any = null;
  filePreviewShop: any = null;
  fileType: "image" | "pdf" | "other" = "other";

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; userData?: any }
  ) {
    this.userForm = this.fb.group({
      owner_name: ["", Validators.required],
      businessName: ["", Validators.required],
      business_email: ["", Validators.required],
      business_phone_no: ["", Validators.required],
      personal_phone_no: ["", Validators.required],
      gst_number: [""],
      business_docs: [""],
      business_address: new FormGroup({
        street: new FormControl('', Validators.required),
        pincode: new FormControl(''),
        state: new FormControl(''),
        city: new FormControl(''),
      }),
      business_front_image: [""]
    });
    this.getBusinessDetailById();
  }

  getBusinessDetailById() {
    this.authService.getBusinessDetailsById(this.data.userData.businessId).subscribe({
      next: (response:any) => {
        const businessData = response;
        this.userForm.patchValue({
          owner_name: businessData.ownerName || '',
          businessName: businessData.businessName || '',
          business_email: businessData.businessEmail || '',
          business_phone_no: businessData.businessPhoneNo || '',
          personal_phone_no: businessData.personalPhoneNo || '',
          gst_number: businessData.gstNumber || '',
          business_docs: businessData.businessDocs || '',
          business_address: {
            street: businessData.businessAddress?.street || '',
            pincode: businessData.businessAddress?.pincode || '',
            state: businessData.businessAddress?.state || '',
            city: businessData.businessAddress?.city || ''
          },
          business_front_image: businessData.businessFrontImage || ''
        });
        this.selectedImageName = businessData.businessFrontImage || '';
        this.selectedFileName = businessData.businessDocs[0] || '';
        this.businessDocUrl = businessData.businessDocs[0] || '';
        this.shopImageUrl = businessData.businessFrontImage || '';
        
        if (this.businessDocUrl) {
          if (this.businessDocUrl.toLowerCase().includes('.pdf')) {
            this.fileType = 'pdf';
            this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.businessDocUrl);
          } else if (this.businessDocUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
            this.fileType = 'image';
            this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.businessDocUrl);
          }
        }
        
        if (this.shopImageUrl) {
          this.filePreviewShop = this.sanitizer.bypassSecurityTrustResourceUrl(this.shopImageUrl);
        }
      },
      error: (error) => {
        console.error(error);
      }
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
      
      if (this.selectedShopImage) {
        formData.append('frontImage', this.selectedShopImage);
      }
      if (this.selectedBusinessDoc) {
        formData.append('docs', this.selectedBusinessDoc);
      }
      
      formData.append('businessName', formValue.businessName || '');
      formData.append('ownerName', formValue.owner_name || '');
      formData.append('businessEmail', formValue.business_email || '');
      formData.append('businessPhoneNo', formValue.business_phone_no || '');
      formData.append('personalPhoneNo', formValue.personal_phone_no || '');
      formData.append('gstNumber', formValue.gst_number || '');
      
      const businessAddress = {
        city: formValue.business_address?.city || '',
        state: formValue.business_address?.state || '',
        street: formValue.business_address?.street || '',
        pincode: formValue.business_address?.pincode || ''
      };
      formData.append('businessAddress', JSON.stringify(businessAddress));
      
      this.authService.updateProfile(this.data.userData.businessId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}