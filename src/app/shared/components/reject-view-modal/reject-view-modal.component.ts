import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reject-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Rejection Remark</h2>
        <button mat-icon-button (click)="close()" class="square-icon-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <mat-icon class="text-red-500 mr-2 mt-1">error_outline</mat-icon>
          <div>
            <p class="text-red-800 font-medium mb-2">Product Rejection Reason:</p>
            <p class="text-red-700">{{ data.rejectRentalProductRemark }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button mat-button (click)="close()" class="text-gray-600">Close</button>
      </div>
    </div>
  `,
  styles: []
})
export class RejectViewModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RejectViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rejectRentalProductRemark: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}