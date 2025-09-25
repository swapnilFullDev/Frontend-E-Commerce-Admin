import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex justify-center items-center p-8">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `
})
export class LoadingComponent {}