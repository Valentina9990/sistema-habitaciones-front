import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../services/room.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { finalize } from 'rxjs';
import { Review } from '../../../shared/models/review';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-reviews',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, RatingModule, FormsModule],
  templateUrl: './room-reviews.component.html',
  styleUrls: ['./room-reviews.component.scss']
})
export class RoomReviewsComponent implements OnChanges {
  @Input() roomId?: number;
  
  reviews: Review[] = [];
  loading = false;
  error = false;

  constructor(private roomService: RoomService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] && this.roomId) {
      this.loadReviews(this.roomId);
    }
  }

  loadReviews(roomId: number): void {
    this.loading = true;
    this.error = false;
    
    this.roomService.getRoomReviews(roomId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (err) => {
          console.error('Error loading reviews:', err);
          this.error = true;
        }
      });
  }
}