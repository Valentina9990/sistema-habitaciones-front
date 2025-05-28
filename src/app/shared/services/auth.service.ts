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

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('currentUser') : null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.userSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from sessionStorage:', e);
        this.userSubject.next(null);
      }
    }
  }

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
  
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User;
          this.userSubject.next(user);
          return user;
        } catch (e) {
          console.error('Error parsing user from sessionStorage:', e);
          return null;
        }
      }
    }
  
    return null;
  }
  
  
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    // console.log('Usuario actual en isAuthenticated:', user); 
    return user !== null;
  }
  
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.rol === role;
  }
  
redirectBasedOnRole(user: User): void {
  switch(user.rol) {
    case 'ADMINISTRADOR':
      this.router.navigate(['/admin/dashboard']);
      break;
    case 'PROPIETARIO':
      this.router.navigate(['/create-room']);
      break;
    case 'CLIENTE':
      this.router.navigate(['/rooms']);
      break;
    case 'VERIFICADOR':
      this.router.navigate(['/verification']);
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
            apellido: response.apellido,
            estado: 'activo',
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
