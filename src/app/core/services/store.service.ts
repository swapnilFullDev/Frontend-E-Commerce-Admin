import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Store } from '../models/store.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private storesSubject = new BehaviorSubject<Store[]>([]);
  public stores$ = this.storesSubject.asObservable();

  constructor() {
    this.loadMockStores();
  }

  private loadMockStores(): void {
    const mockStores: Store[] = [
      {
        id: 1,
        name: 'Downtown Electronics',
        location: 'Downtown',
        owner: 'Michael Chen',
        contactPhone: '+1-555-0123',
        contactEmail: 'michael@downtown-electronics.com',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isActive: true,
        createdAt: new Date('2024-01-05')
      },
      {
        id: 2,
        name: 'Fashion Forward',
        location: 'Mall Plaza',
        owner: 'Sarah Johnson',
        contactPhone: '+1-555-0456',
        contactEmail: 'sarah@fashionforward.com',
        address: '456 Mall Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        isActive: true,
        createdAt: new Date('2024-02-12')
      },
      {
        id: 3,
        name: 'Book Corner',
        location: 'University District',
        owner: 'David Wilson',
        contactPhone: '+1-555-0789',
        contactEmail: 'david@bookcorner.com',
        address: '789 University Blvd',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        isActive: false,
        createdAt: new Date('2024-03-01')
      }
    ];
    this.storesSubject.next(mockStores);
  }

  getStores(): Observable<Store[]> {
    return this.stores$.pipe(delay(500));
  }

  createStore(store: Omit<Store, 'id' | 'createdAt'>): Observable<Store> {
    const newStore: Store = {
      ...store,
      id: Math.max(...this.storesSubject.value.map(s => s.id)) + 1,
      createdAt: new Date()
    };
    
    const currentStores = this.storesSubject.value;
    this.storesSubject.next([...currentStores, newStore]);
    
    return of(newStore).pipe(delay(500));
  }

  updateStore(id: number, store: Partial<Store>): Observable<Store> {
    const currentStores = this.storesSubject.value;
    const storeIndex = currentStores.findIndex(s => s.id === id);
    
    if (storeIndex !== -1) {
      const updatedStore = { ...currentStores[storeIndex], ...store };
      currentStores[storeIndex] = updatedStore;
      this.storesSubject.next([...currentStores]);
      return of(updatedStore).pipe(delay(500));
    }
    
    throw new Error('Store not found');
  }

  deleteStore(id: number): Observable<boolean> {
    const currentStores = this.storesSubject.value;
    const filteredStores = currentStores.filter(s => s.id !== id);
    this.storesSubject.next(filteredStores);
    
    return of(true).pipe(delay(500));
  }
}