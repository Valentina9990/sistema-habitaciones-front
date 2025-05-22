import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Room } from '../models/room';
import { VerificationHistoryItem } from '../models/verification-item';
import { VerificationRequest } from '../models/verification-request';

@Injectable({
  providedIn: 'root'
})
export class RoomVerificationService {
  private readonly API_URL_ROOMS = `${environment.api.rooms}`;

  constructor(private http: HttpClient) { }

  getUnverifiedRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL_ROOMS);
  }

  getVerificationHistory(): Observable<VerificationHistoryItem[]> {
    return this.http.get<VerificationHistoryItem[]>(`${this.API_URL_ROOMS}/history`);
  }

  verifyRoom(verificationData: VerificationRequest): Observable<any> {
    return this.http.post(`${this.API_URL_ROOMS}`, verificationData);
  }
  
}
