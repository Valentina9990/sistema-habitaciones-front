import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ReservationRequest } from '../models/reservation-request';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = environment.api.booking;

  constructor(private http: HttpClient) { }

  createReservation(reservationData: ReservationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reservationData);
  }

}