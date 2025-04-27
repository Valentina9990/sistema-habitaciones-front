import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Service } from '../../../shared/models/service';
import { environment } from '../../../../environments/environments';
import { Room } from '../../../shared/models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly API_URL = `${environment.api.users}/rooms`;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL);
  }

  getRoomsByCity(city: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL}?ciudad=${city}`);
  }

  getRoomsByPriceRange(min: number, max: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL}?precio_min=${min}&precio_max=${max}`);
  }

  getRoomsByCapacity(capacity: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API_URL}?capacidad=${capacity}`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.API_URL}/${id}`);
  }

  getRoomsWithServices(): Observable<Room[]> {
    return forkJoin({
      rooms: this.getRooms(),
      allServices: this.http.get<Service[]>(`${environment.api.users}/services`)
    }).pipe(
      map(({ rooms, allServices }) => {
        return rooms.map(room => {
          const serviciosIncluidos = Array.isArray(room.serviciosIncluidos) 
            ? room.serviciosIncluidos 
            : [];
  
          const serviciosAdicionales = Array.isArray(room.serviciosAdicionales) 
            ? room.serviciosAdicionales 
            : [];
  
          return {
            ...room,
            serviciosIncluidos,
            serviciosAdicionales
          };
        });
      })
    );
  }

  searchRooms(filters: {
    ciudad?: string;
    precioMin?: number;
    precioMax?: number;
    capacidad?: number;
    servicios?: number[];
  }): Observable<Room[]> {
    let url = `${this.API_URL}/search?`;
    const params = [];
    
    if (filters.ciudad) params.push(`ciudad=${filters.ciudad}`);
    if (filters.precioMin) params.push(`precio_min=${filters.precioMin}`);
    if (filters.precioMax) params.push(`precio_max=${filters.precioMax}`);
    if (filters.capacidad) params.push(`capacidad=${filters.capacidad}`);
    if (filters.servicios?.length) params.push(`servicios=${filters.servicios.join(',')}`);

    return this.http.get<Room[]>(url + params.join('&'));
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.API_URL);
  }

  getServicesByType(tipo: 'incluido' | 'adicional'): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API_URL}?tipo=${tipo}`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL}/${id}`);
  }
}