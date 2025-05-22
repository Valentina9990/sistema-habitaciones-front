import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Room } from '../models/room';
import { Service } from '../models/service';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class RoomAmenityService {
  private readonly API_URL_ROOMS = `${environment.api.rooms}`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.API_URL_ROOMS);
  }

  getServicesByType(tipo: 'incluido' | 'adicional'): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API_URL_ROOMS}?tipo=${tipo}`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL_ROOMS}/${id}`);
  }
}
