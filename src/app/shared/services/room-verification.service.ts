import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Room } from '../models/room';
import { VerificationHistoryItem } from '../models/verification-item';

@Injectable({
  providedIn: 'root'
})
export class RoomVerificationService {
  private readonly API_URL_ROOMS = `${environment.api.rooms}`;

  constructor(private http: HttpClient) { }

  getUnverifiedRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL_ROOMS}/search?verificada=true`);
  }

  getVerificationHistory(): Observable<VerificationHistoryItem[]> {
    return this.http.get<VerificationHistoryItem[]>(`${this.API_URL_ROOMS}/history`);
  }

  verifyRoom(id: number, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.API_URL_ROOMS}/${id}`, room);
  }
}
