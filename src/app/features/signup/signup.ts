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
      })
      ,
      business_front_image: ["", [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFileName = file.name;
    this.userForm.patchValue({ business_docs: "https://www.wikihow.com/images/thumb/9/93/Store-Important-Documents-at-Home-Step-8.jpg/v4-460px-Store-Important-Documents-at-Home-Step-8.jpg" });
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
    this.userForm.patchValue({ business_front_image: "https://static.vecteezy.com/system/resources/previews/006/398/494/non_2x/illustration-of-store-or-market-flat-design-vector.jpg" });
    this.userForm.get("business_front_image")?.updateValueAndValidity();

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
      this.authService.signUpStore(this.userForm.value).subscribe((response:any)=>{
        console.log(response);
      })
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }
}
