import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Store } from '../models/store.interface';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private storesSubject = new BehaviorSubject<Store[]>([]);
  public stores$ = this.storesSubject.asObservable();
  private httpClient = inject(HttpClient);
  constructor() {  }

  getStores(pageNo=1,limit=5,searchName=""): Observable<Store[]> {
    return this.httpClient
      .get<any>(`${environment.API_URL}${environment.businessMiddleWare}/all?page=${pageNo}&limit=${limit}&businessName=${searchName}`);
  }

  createStore(store: Omit<Store, "id" | "createdAt">) {}

  updateStore(id: number, store: Partial<Store>) {}

  deleteStore(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.API_URL}${environment.businessMiddleWare}/soft-delete/${id}`);
  }

  updateStoreStatus(id:number):Observable<any>{
    return this.httpClient.put(`${environment.API_URL}${environment.adminMiddleWare}/approve/${id}`,{});
  }
}