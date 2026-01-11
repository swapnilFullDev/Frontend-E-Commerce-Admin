import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { StoresComponent } from "../stores.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-store-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: "./view-store.html",
})
export class ViewStore {
  constructor(
    private dialogRef: MatDialogRef<StoresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null = null
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
