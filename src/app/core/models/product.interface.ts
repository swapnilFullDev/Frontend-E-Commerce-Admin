export interface Product {
  id: number;
  inventoryMasterId:number;
  name: string;
  productName:string,
  price: number;
  category: string;
  description?: string;
  image?: string;
  isApproved: boolean;
  submittedBy?: string;
  submittedDate?: Date;
  stock: number;
  createdAt: Date;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
}