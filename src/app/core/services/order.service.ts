import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadMockOrders();
  }

  private loadMockOrders(): void {
    const mockOrders: Order[] = [
      {
        id: 1001,
        customerId: 1,
        customerName: 'John Customer',
        customerEmail: 'john@customer.com',
        totalAmount: 1299.99,
        status: 'Delivered',
        orderDate: new Date('2024-03-01'),
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        shippingAddress: {
          street: '123 Customer St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        items: [
          {
            id: 1,
            productId: 2,
            productName: 'Laptop',
            price: 1299.99,
            quantity: 1,
            subtotal: 1299.99
          }
        ]
      },
      {
        id: 1002,
        customerId: 2,
        customerName: 'Jane Buyer',
        customerEmail: 'jane@buyer.com',
        totalAmount: 749.98,
        status: 'Processing',
        orderDate: new Date('2024-03-15'),
        paymentMethod: 'PayPal',
        paymentStatus: 'Paid',
        shippingAddress: {
          street: '456 Buyer Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        items: [
          {
            id: 2,
            productId: 1,
            productName: 'Smartphone',
            price: 699.99,
            quantity: 1,
            subtotal: 699.99
          },
          {
            id: 3,
            productId: 4,
            productName: 'Programming Book',
            price: 49.99,
            quantity: 1,
            subtotal: 49.99
          }
        ]
      },
      {
        id: 1003,
        customerId: 3,
        customerName: 'Bob Purchaser',
        customerEmail: 'bob@purchaser.com',
        totalAmount: 59.98,
        status: 'Pending',
        orderDate: new Date('2024-03-20'),
        paymentMethod: 'Credit Card',
        paymentStatus: 'Pending',
        shippingAddress: {
          street: '789 Purchaser Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        items: [
          {
            id: 4,
            productId: 3,
            productName: 'T-Shirt',
            price: 29.99,
            quantity: 2,
            subtotal: 59.98
          }
        ]
      }
    ];
    this.ordersSubject.next(mockOrders);
  }

  getOrders(): Observable<Order[]> {
    return this.orders$.pipe(delay(500));
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o.id === id);
    return of(order).pipe(delay(300));
  }

  updateOrderStatus(id: number, status: Order['status']): Observable<Order> {
    const currentOrders = this.ordersSubject.value;
    const orderIndex = currentOrders.findIndex(o => o.id === id);
    
    if (orderIndex !== -1) {
      const updatedOrder = { ...currentOrders[orderIndex], status };
      currentOrders[orderIndex] = updatedOrder;
      this.ordersSubject.next([...currentOrders]);
      return of(updatedOrder).pipe(delay(500));
    }
    
    throw new Error('Order not found');
  }
}