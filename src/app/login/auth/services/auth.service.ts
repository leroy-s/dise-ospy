import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthLoginRequest, AuthResponse } from '../AuthLoginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly jwtHelper = new JwtHelperService();
  private authUser = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.authUser.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  public login(credentials: AuthLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.status) {
            this.setSession(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authUser.next(null);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('token', response.jwt);
    localStorage.setItem('username', response.username);
    this.authUser.next(response);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  getUserAuthorities(): string[] {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.authorities?.split(',') || [];
      } catch {
        return [];
      }
    }
    return [];
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  private checkToken(): void {
    const token = this.getToken();
    const username = this.getCurrentUser();

    if (token && username && this.isTokenValid()) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.authUser.next({
        username,
        jwt: token,
        status: true,
        message: 'Sesión restaurada',
        authorities: decodedToken.authorities
      });
    } else {
      this.logout();
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Error del servidor';
    }
    return throwError(() => errorMessage);
  }
}
