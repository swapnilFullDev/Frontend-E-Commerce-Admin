import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/user.interface';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: "./main-layout.html",
  styleUrls: ["./main-layout.css"]
})
export class MainLayoutComponent implements OnInit {
  currentUser$: Observable<AuthUser | null>;
  collapsed = false;
  dropdownStates = {
    orders: false,
    products: false,
    rental: false
  };
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;    
  }

  ngOnInit(): void {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.drawer?.close();
      } else {
        this.drawer?.open();
      }
    });
  }

  toggleDropdown(dropdown: keyof typeof this.dropdownStates): void {
    // Close all other dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== dropdown) {
        this.dropdownStates[key as keyof typeof this.dropdownStates] = false;
      }
    });
    // Toggle the selected dropdown
    this.dropdownStates[dropdown] = !this.dropdownStates[dropdown];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}