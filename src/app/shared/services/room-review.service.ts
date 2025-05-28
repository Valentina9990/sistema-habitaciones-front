import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class RoomReviewService {
  private readonly API_URL_Reviews = `${environment.api.reviews}`;
  
  constructor(private http: HttpClient) { }

  getRoomReviews(roomId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL_Reviews}?habitacionId=${roomId}`);
  }
}
