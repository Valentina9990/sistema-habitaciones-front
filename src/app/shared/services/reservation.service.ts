import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ReservationRequest } from '../models/reservation-request';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = environment.api.booking;

  constructor(private http: HttpClient) { }

  createReservation(reservationData: ReservationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reservationData);
  }

  getReservationsByUserId(usuarioId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}`);
  }

  deleteReservation(reservationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reservationId}`);
  }

}