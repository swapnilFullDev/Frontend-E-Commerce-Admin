interface Address {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  userId: number;
  name: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profileImage?: string;
  role: 'Admin' | 'Manager' | 'Employee';
  isActive: boolean;
  isDeleted: boolean;
  // addressInfo?: Address;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
}