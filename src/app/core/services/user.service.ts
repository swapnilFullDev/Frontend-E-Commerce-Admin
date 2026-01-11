import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  private httpClient = inject(HttpClient);
  constructor() {}

  getUsers(): Observable<any[]> {
    // return this.users$.pipe(delay(500));
    return this.httpClient.get<any[]>(`${environment.API_URL}${environment.authMiddleWare}/get-all`);
  }

  softDeleteUser(id:number){
    return this.httpClient.delete(`${environment.API_URL}${environment.authMiddleWare}/soft/${id}`);
  }

  permanentDeleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.API_URL}${environment.authMiddleWare}/hard/${id}`);
  }
}