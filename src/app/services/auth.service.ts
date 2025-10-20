import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, RegisterRequest, LoginRequest, LoginResponse } from '../models/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/users`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  public userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
  }

  logout(): void {
    this.removeToken();
    this.removeUserName();
    this.removeUserId();
    this.removeRole();
  }

  setUserName(userName: string): void {
    localStorage.setItem('userName', userName);
    this.userNameSubject.next(userName);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  removeUserName(): void {
    localStorage.removeItem('userName');
    this.userNameSubject.next(null);
  }

  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  }

  removeUserId(): void {
    localStorage.removeItem('userId');
  }

  setRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  removeRole(): void {
    localStorage.removeItem('userRole');
  }
}
