import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../shared/services/reservation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
  providers: [ConfirmationService, MessageService],
  imports: [CommonModule, SharedModule, ConfirmDialogModule, NavbarComponent],
  standalone: true
})
export class ReservationsListComponent implements OnInit {
  reservations: any[] = [];
  loading = true;
  userId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUserReservations();
  }

  loadUserReservations(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.loading = false;
      return;
    }

    this.userId = user.id;
    this.reservationService.getReservationsByUserId(user.id).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las reservas'
        });
      }
    });
  }

  confirmCancel(reservationId: string): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cancelar esta reserva?',
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.cancelReservation(reservationId);
      }
    });
  }

  private cancelReservation(reservationId: string): void {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reserva cancelada correctamente'
        });
        this.loadUserReservations();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cancelar la reserva'
        });
      }
    });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('es-ES');
  }
}