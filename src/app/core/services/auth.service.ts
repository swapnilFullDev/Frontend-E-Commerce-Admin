import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthUser, LoginCredentials } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthUser> {
    // Mock authentication - in real app, this would call your API
    if (credentials.email === 'admin@admin.com' && credentials.password === 'admin@123') {
      const user: AuthUser = {
        id: 1,
        name: 'Admin User',
        email: credentials.email,
        role: 'Admin',
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      return of(user).pipe(delay(1000));
    }
    
    // throw new Error('Invalid credentials');
    return throwError(()=> new Error('Invalid credentials'))
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}