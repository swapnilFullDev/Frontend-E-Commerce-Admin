import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, delay, map, tap } from "rxjs/operators";
import { AuthUser, LoginCredentials } from "../models/user.interface";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private baseUrl = environment.API_URL;
  httpClient = inject(HttpClient);

  constructor() {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  loginUser(credentials: any): Observable<any> {
    return this.httpClient
      .post(`${this.baseUrl}${environment.authMiddleWare}/login`, credentials)
      .pipe(
        tap((response: any) => {
          // Assuming your API returns { id, name, email, role, token }
          if (response && response.token) {
            localStorage.setItem("currentUser", JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
        }),
        catchError((error) => {
          console.error("Login failed:", error);
          return throwError(() => new Error("Invalid credentials"));
        })
      );
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  signUpStore(storeData: any) {
    return this.httpClient.post(
      `${this.baseUrl}${environment.businessMiddleWare}/create`,
      storeData
    );
  }

  getBusinessDetailsById(id: string) {
    return this.httpClient.get(
      `${this.baseUrl}${environment.businessMiddleWare}/${id}`
    );
  }

  updateProfile(businessId: number, updateData: any) {
    return this.httpClient.put(`${this.baseUrl}${environment.businessMiddleWare}/businessId/${businessId}`, updateData);
  }
}
