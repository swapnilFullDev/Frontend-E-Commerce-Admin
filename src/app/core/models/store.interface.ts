export interface Store {
  id: number;
  name: string;
  location: string;
  owner: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
  createdAt: Date;
}