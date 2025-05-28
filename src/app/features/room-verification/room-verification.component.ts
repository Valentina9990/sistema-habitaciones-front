import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RoomVerificationService } from '../../shared/services/room-verification.service';
import { Room } from '../../shared/models/room';
import { RoomReviewService } from '../../shared/services/room-review.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { RoomReviewModalComponent } from '../room-reviews/components/room-review-modal/room-review-modal.component';

@Component({
  selector: 'app-room-verification',
  imports: [
    NavbarComponent,
    CommonModule,
    SharedModule,
    RoomReviewModalComponent,
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './room-verification.component.html',
  styleUrl: './room-verification.component.scss',
})
export class RoomVerificationComponent implements OnInit {
  unverifiedRooms: Room[] = [];
  verificationHistory: any[] = [];
  loading = true;
  activeTab: 'unverified' | 'history' = 'unverified';
  showReviewModal = false;
  selectedRoom: Room | null = null;

  constructor(
    private roomVerificationService: RoomVerificationService,
    private roomReviewService: RoomReviewService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadUnverifiedRooms();
  }

  loadUnverifiedRooms(): void {
    this.loading = true;
    this.roomVerificationService.getUnverifiedRooms().subscribe({
      next: (rooms) => {
        this.unverifiedRooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading unverified rooms:', error);
        this.loading = false;
      },
    });
  }

  openReviewModal(room: Room): void {
    this.selectedRoom = room;
    this.showReviewModal = true;
  }

  onReviewSubmit(reviewData: any): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !this.selectedRoom) {
      console.error('No authenticated user or room selected');
      return;
    }

    const reviewPayload = {
      usuarioId: currentUser.id,
      habitacionId: this.selectedRoom.id,
      fecha: this.formatDateForBackend(new Date()),
      calificacion: reviewData.calificacion,
      comentario: reviewData.comentario,
    };

    this.roomReviewService.addReview(reviewPayload).subscribe({
      next: (response) => {
        this.verifyRoom(this.selectedRoom!);
      },
      error: (error) => {
        console.error('Error adding review:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al agregar la revisión',
          life: 5000,
        });
      },
    });
  }

  private verifyRoom(room: Room): void {
    const updatedRoom = { verificada: true };

    this.roomVerificationService.verifyRoom(room.id, updatedRoom).subscribe({
      next: (verifiedRoom) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Revisión agregada y habitación verificada correctamente',
          life: 3000,
        });
        this.showReviewModal = false;
        this.onRoomVerified();
      },
      error: (error) => {
        console.error('Error verifying room:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail:
            'Revisión creada pero hubo un error al verificar la habitación',
          life: 5000,
        });
        this.showReviewModal = false;
        this.onRoomVerified();
      },
    });
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString();
  }

  onTabChange(tab: 'unverified' | 'history'): void {
    this.activeTab = tab;
  }

  getIncludedServices(room: Room): string {
    if (!room.serviciosIncluidos || room.serviciosIncluidos.length === 0) {
      return 'Ninguno';
    }
    return room.serviciosIncluidos.map((service) => service.nombre).join(', ');
  }

  getAdditionalServices(room: Room): string {
    if (!room.serviciosAdicionales || room.serviciosAdicionales.length === 0) {
      return 'Ninguno';
    }
    return room.serviciosAdicionales
      .map((service) => service.nombre)
      .join(', ');
  }

  onRoomVerified(): void {
    this.loadInitialData();
  }
}
