import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { User } from '../../../shared/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.api.users;

  constructor(private http: HttpClient) { }

  getUserById(userId: number): Observable<User> {
    if (!userId || userId <= 0) {
      return throwError(() => new Error('ID de usuario inválido'));
    }

    return this.http.get<User>(`${this.API_URL}/${userId}`).pipe(
      catchError(error => {
        console.error('Error al obtener usuario:', error);
        return throwError(() => new Error('No se pudo obtener el usuario'));
      })
    );
  }

  updateUser(userId: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${userId}`, userData);
  }
  
}