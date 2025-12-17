import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7055/api/Auth';

  constructor(private http: HttpClient) { }

  register(model: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string {
    return localStorage.getItem('username') || '';
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }

  saveUserData(userName: string, role: string, userId: string) {
    localStorage.setItem('username', userName);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

}
