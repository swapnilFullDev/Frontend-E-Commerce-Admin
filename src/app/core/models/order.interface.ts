export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Date;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}