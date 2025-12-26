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

  getRentalProducts(): Observable<any> {
    return this.httpClient.get<any[]>(`${environment.API_URL}${environment.inventoryMiddleWare}/online-rentals/filter?sizes=L&rentalPriceRange=0-50&page=1&limit=10`);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.categories$.pipe(delay(300));
  }

  getPendingProducts(): Observable<Product[]> {
    return this.products$.pipe(
      delay(500),
      map(() => this.productsSubject.value.filter((p) => !p.isApproved))
    );
  }

  createProduct(
    product: Omit<Product, "id" | "createdAt">
  ): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.productsSubject.value.map((p) => p.id)) + 1,
      createdAt: new Date(),
    };

    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, newProduct]);

    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const productIndex = currentProducts.findIndex((p) => p.id === id);

    if (productIndex !== -1) {
      const updatedProduct = { ...currentProducts[productIndex], ...product };
      currentProducts[productIndex] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
      return of(updatedProduct).pipe(delay(500));
    }

    throw new Error("Product not found");
  }

  deleteProduct(id: number): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter((p) => p.id !== id);
    this.productsSubject.next(filteredProducts);

    return of(true).pipe(delay(500));
  }

  approveProduct(id: number, comments?: string): Observable<boolean> {
    return this.updateProduct(id, { isApproved: true }).pipe(map(() => true));
  }

  rejectProduct(id: number, comments: string): Observable<boolean> {
    return this.deleteProduct(id);
  }
}