import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class ProductService {
  httpClient = inject(HttpClient);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ProductCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockCategories: ProductCategory[] = [
      {
        id: 1,
        name: "Electronics",
        description: "Electronic devices and accessories",
      },
    ];

    const mockProducts: Product[] = [];

    this.categoriesSubject.next(mockCategories);
    this.productsSubject.next(mockProducts);
  }

  getProducts(page: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any[]>(`${environment.API_URL}${environment.inventoryMiddleWare}/online-products/filter?page=${page}&pageSize=${pageSize}`);
  }

  getOnlineVerifiedProducts(page: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${environment.API_URL}${environment.inventoryMiddleWare}/get/online/verified`);
  }

  deleteProduct(id: number): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter((p) => p.id !== id);
    this.productsSubject.next(filteredProducts);

    return of(true).pipe(delay(500));
  }

  approveProduct(id: number) {
    return this.httpClient.post(`${environment.API_URL}${environment.inventoryMiddleWare}/verify-online/${id}`, {})
  }

  rejectProduct(id: number, remark: string): Observable<any> {
    return this.httpClient.put(`${environment.API_URL}${environment.inventoryMiddleWare}/reject/inventoryMasterId/${id}`, { remark });
  }
}