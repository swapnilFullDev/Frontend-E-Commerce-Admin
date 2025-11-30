import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const AUTH_EXCLUDE_URLS = [
  '/login',
  '/register',
  '/auth/refresh', // add any others you need
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  let cloned = req;
  
  const shouldSkip = AUTH_EXCLUDE_URLS.some((url) => req.url.includes(url));

  if (!shouldSkip) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const localData = JSON.parse(storedUser);
        const token = localData?.token;
        if (token) {
          cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // If parsing fails, continue without token - let the server handle it
      }
    }
  }


  return next(cloned).pipe(
    catchError((error: HttpErrorResponse)=>{
      let message = 'Something went wrong.';

      switch (error.status) {
        case 401:
          message = "Unauthorized! Please log in again.";
          router.navigateByUrl("/login");
          break;
        case 403:
          message = "Access denied!";
          break;
        case 404:
          message = "Resource not found!";
          break;
        case 500:
          message = "Server error. Please try again later.";
          break;
      }

      return throwError(() => new Error(message));
    })
  );
};
