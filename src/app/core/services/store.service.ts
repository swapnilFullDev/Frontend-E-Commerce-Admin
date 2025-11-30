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

  getStores(): Observable<Store[]> {
    return this.httpClient
      .get<any>(`${environment.API_URL}${environment.businessMiddleWare}`)
      // .pipe(
      //   map(
      //     (data) => (
      //       data.map((item:any) => ({
      //         id: item.ID,
      //         ownerName: item.OwnerName,
      //         businessName: item.BusinessName,
      //         businessEmail: item.BusinessEmail,
      //         businessPhoneNo: item.BusinessPhoneNo,
      //         personalPhoneNo: item.PersonalPhoneNo,
      //         gstNumber: item.GSTNumber,
      //         businessDocs: item.BusinessDocs,
      //         businessAddress: item.BusinessAddress,
      //         businessFrontImage: item.BusinessFrontImage,
      //         isVerified: !!item.isVerified,
      //       }))
      //     )
      //   )
      // )
  }

  createStore(store: Omit<Store, "id" | "createdAt">): Observable<Store> {
    const newStore: Store = {
      ...store,
      id: Math.max(...this.storesSubject.value.map((s) => s.id)) + 1,
      // createdAt: new Date(),
    };

    const currentStores = this.storesSubject.value;
    this.storesSubject.next([...currentStores, newStore]);

    return of(newStore).pipe(delay(500));
  }

  updateStore(id: number, store: Partial<Store>): Observable<Store> {
    const currentStores = this.storesSubject.value;
    const storeIndex = currentStores.findIndex((s) => s.id === id);

    if (storeIndex !== -1) {
      const updatedStore = { ...currentStores[storeIndex], ...store };
      currentStores[storeIndex] = updatedStore;
      this.storesSubject.next([...currentStores]);
      return of(updatedStore).pipe(delay(500));
    }

    throw new Error("Store not found");
  }

  deleteStore(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.API_URL}${environment.businessMiddleWare}/${id}`);
  }

  updateStoreStatus(id:number):Observable<any>{
    return this.httpClient.put(`${environment.API_URL}${environment.adminMiddleWare}/approve/${id}`,{});
  }
}