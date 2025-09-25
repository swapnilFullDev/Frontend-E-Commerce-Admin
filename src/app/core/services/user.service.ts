import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadMockUsers();
  }

  private loadMockUsers(): void {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        createdAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Manager',
        createdAt: new Date('2024-02-10'),
        isActive: true
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        role: 'Employee',
        createdAt: new Date('2024-03-05'),
        isActive: false
      },
      {
        id: 4,
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        role: 'Manager',
        createdAt: new Date('2024-03-20'),
        isActive: true
      }
    ];
    this.usersSubject.next(mockUsers);
  }

  getUsers(): Observable<User[]> {
    return this.users$.pipe(delay(500));
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.usersSubject.value.map(u => u.id)) + 1,
      createdAt: new Date()
    };
    
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);
    
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex(u => u.id === id);
    
    if (userIndex !== -1) {
      const updatedUser = { ...currentUsers[userIndex], ...user };
      currentUsers[userIndex] = updatedUser;
      this.usersSubject.next([...currentUsers]);
      return of(updatedUser).pipe(delay(500));
    }
    
    throw new Error('User not found');
  }

  deleteUser(id: number): Observable<boolean> {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter(u => u.id !== id);
    this.usersSubject.next(filteredUsers);
    
    return of(true).pipe(delay(500));
  }
}