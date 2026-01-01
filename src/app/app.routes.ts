import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: 'signup',
    loadComponent: () => import('./features/signup/signup').then(s => s.Signup)
  },
  { path: 'reset-password/:token',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  { path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory').then(i => i.Inventory)
      },
      { path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      // { path: 'categories',
      //   loadComponent: () => import('./features/categorys/categorys').then(c => c.Categorys)
      // },
      { path: 'stores',
        loadComponent: () => import('./features/stores/stores.component').then(m => m.StoresComponent)
      },
      { path: 'orders',
        loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
      },
      { path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
        children: [
          { path: 'approve-products',
            loadComponent: () => import('./features/products/approvals/approvals.component').then(m => m.ApprovalsComponent)
          },
          { path: 'reject-products',
            loadComponent: () => import('./features/products/online-reject/online-reject').then(m => m.OnlineReject)
          },
        ]
      },
      { path: 'rental-products',
        loadComponent: () => import('./features/rental-products/rental-products').then(r => r.RentalProducts),
        children: [
          { path: 'rental-approve-products',
            loadComponent: () => import('./features/rental-products/rental-approvals/approvals.component').then(m => m.RentalApprovalsComponent)
          },
          { path: 'rental-reject-products',
            loadComponent: () => import('./features/rental-products/rental-reject/rental-reject').then(m => m.RentalReject)
          }
        ]
      },
    ]
  },
  { path: '**', redirectTo: '/login' }
];