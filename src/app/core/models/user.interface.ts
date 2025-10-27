export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}