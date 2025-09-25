import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ProductCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockCategories: ProductCategory[] = [
      { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
      { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
      { id: 3, name: 'Books', description: 'Books and educational materials' },
      { id: 4, name: 'Home & Garden', description: 'Home improvement and garden items' }
    ];

    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Smartphone',
        price: 699.99,
        category: 'Electronics',
        description: 'Latest smartphone with advanced features',
        stock: 50,
        isApproved: true,
        createdAt: new Date('2024-01-10')
      },
      {
        id: 2,
        name: 'Laptop',
        price: 1299.99,
        category: 'Electronics',
        description: 'High-performance laptop for professionals',
        stock: 30,
        isApproved: true,
        createdAt: new Date('2024-02-05')
      },
      {
        id: 3,
        name: 'T-Shirt',
        price: 29.99,
        category: 'Clothing',
        description: 'Comfortable cotton t-shirt',
        stock: 100,
        isApproved: false,
        submittedBy: 'Store Manager',
        submittedDate: new Date('2024-03-15'),
        createdAt: new Date('2024-03-15')
      },
      {
        id: 4,
        name: 'Programming Book',
        price: 49.99,
        category: 'Books',
        description: 'Learn modern web development',
        stock: 25,
        isApproved: true,
        createdAt: new Date('2024-02-20')
      }
    ];

    this.categoriesSubject.next(mockCategories);
    this.productsSubject.next(mockProducts);
  }

  getProducts(): Observable<Product[]> {
    return this.products$.pipe(delay(500));
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.categories$.pipe(delay(300));
  }

  getPendingProducts(): Observable<Product[]> {
    return this.products$.pipe(
      delay(500),
      map(() => this.productsSubject.value.filter(p => !p.isApproved))
    );
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.productsSubject.value.map(p => p.id)) + 1,
      createdAt: new Date()
    };
    
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, newProduct]);
    
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const productIndex = currentProducts.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
      const updatedProduct = { ...currentProducts[productIndex], ...product };
      currentProducts[productIndex] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
      return of(updatedProduct).pipe(delay(500));
    }
    
    throw new Error('Product not found');
  }

  deleteProduct(id: number): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    this.productsSubject.next(filteredProducts);
    
    return of(true).pipe(delay(500));
  }

  approveProduct(id: number, comments?: string): Observable<boolean> {
    return this.updateProduct(id, { isApproved: true }).pipe(
      map(() => true)
    );
  }

  rejectProduct(id: number, comments: string): Observable<boolean> {
    return this.deleteProduct(id);
  }
}