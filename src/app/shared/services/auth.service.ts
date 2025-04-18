import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
  }
  
  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  getCurrentUser(): User | null {
    if (this.userSubject.value) {
      return this.userSubject.value;
    }
    
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      this.userSubject.next(user);
      return user;
    }
    
    return null;
  }
  
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
  
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === role;
  }
  
  redirectBasedOnRole(user: User): void {
    switch(user.role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'PROPIETARIO':
        this.router.navigate(['/propietario/habitaciones']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente/reservas']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
