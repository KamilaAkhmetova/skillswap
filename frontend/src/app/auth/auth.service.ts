import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api/auth';

  // signal — чтобы компоненты сразу реагировали на изменение статуса логина
  isLoggedIn = signal<boolean>(!!localStorage.getItem('access_token'));

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, email, password });
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedIn.set(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}