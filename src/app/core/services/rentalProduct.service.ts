import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class RentalProductService {
  httpClient = inject(HttpClient);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ProductCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() { }


  getRentalProducts(page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get<any>(`${environment.API_URL}${environment.inventoryMiddleWare}/online-rentals/filter?page=${page}&limit=${limit}`);
  }

  getOnlineVerifiedProducts(page: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}${environment.inventoryMiddleWare}/get/rental/verified`);
  }

  deleteRentalProduct(id: number) {
    return this.httpClient.delete(`${environment.API_URL}${environment.inventoryMiddleWare}/rental/${id}`);
  }

  getPendingProducts(page: number, limit: number): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}${environment.inventoryMiddleWare}/online-rentals/filter?page=${page}&limit=${limit}`);
  }

  approveRentalProduct(id: number) { 
    return this.httpClient.post(`${environment.API_URL}${environment.inventoryMiddleWare}/verify-rental/${id}`, { });
   }

  rejectRentalProduct(id: number, remark: string) { 
    return this.httpClient.put(`${environment.API_URL}${environment.inventoryMiddleWare}/reject/inventoryMasterId/${id}`, { remark });
  }
}