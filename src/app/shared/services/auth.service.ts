import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { LoginRequest, RegisterRequest, RegisterResponse } from '../models/auth-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.api.users;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));

          this.redirectBasedOnRole(user);
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
    return user !== null && user.rol === role;
  }
  
  redirectBasedOnRole(user: User): void {
    switch(user.rol) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'PROPIETARIO':
        this.router.navigate(['/propietario/habitaciones']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/rooms']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, registerData)
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            correo: response.correo,
            contrasena: registerData.contrasena,
            rol: response.rol,
            nombre: response.nombre,
            apellido: response.apellido
          };
          this.userSubject.next(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.redirectBasedOnRole(user);
        }),
        catchError(error => {
          console.error('Error en el registro:', error);
          return throwError(() => error);
        })
      );
  }
}
