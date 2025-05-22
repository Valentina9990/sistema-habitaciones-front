import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../../shared/models/room';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SharedModule } from '../../../shared/shared.module';
import { GalleriaModule } from 'primeng/galleria';
import { finalize } from 'rxjs/operators';
import { RoomService } from '../../../shared/services/room.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RoomReviewsComponent } from "../../room-reviews/room-reviews.component";

@Component({
  selector: 'app-room-detail',
  imports: [NavbarComponent, SharedModule, GalleriaModule, ProgressSpinnerModule, RoomReviewsComponent],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent implements OnInit {
  room?: Room;
  roomId?: number;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomId = +roomId;
      this.loadRoomDetails(this.roomId);
    }
  }

  loadRoomDetails(roomId: number): void {
    this.loading = true;
    this.error = false;
    
    this.roomService.getRoomById(roomId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (room) => {
          this.room = room;
        },
        error: (err) => {
          console.error('Error loading room details:', err);
          this.error = true;
        }
      });
  }

  getIncludedServices(): string {
    return this.room?.serviciosIncluidos?.map(s => s.nombre).join(', ') || 'No hay servicios incluidos';
  }

  getAdditionalServices(): string {
    const services = this.room?.serviciosAdicionales?.map(s => 
      s.precio ? `${s.nombre} ($${s.precio})` : s.nombre
    );
    return services?.join(', ') || 'No hay servicios adicionales';
  }
}