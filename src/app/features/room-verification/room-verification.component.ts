import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RoomVerificationService } from '../../shared/services/room-verification.service';
import { Room } from '../../shared/models/room';
import { RoomReviewService } from '../../shared/services/room-review.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-room-verification',
  imports: [NavbarComponent, CommonModule, SharedModule],
  standalone: true,
  templateUrl: './room-verification.component.html',
  styleUrl: './room-verification.component.scss'
})
export class RoomVerificationComponent implements OnInit {
  unverifiedRooms: Room[] = [];
  verificationHistory: any[] = [];
  loading = true;
  activeTab: 'unverified' | 'history' = 'unverified';

  constructor(
    private roomVerificationService: RoomVerificationService,
    private roomReviewService: RoomReviewService
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
      }
    });
  }

  onTabChange(tab: 'unverified' | 'history'): void {
    this.activeTab = tab;
  }

  openReviewModal(room: Room): void {
    console.log('Opening review modal for room:', room.id);
  }

  getIncludedServices(room: Room): string {
    if (!room.serviciosIncluidos || room.serviciosIncluidos.length === 0) {
      return 'Ninguno';
    }
    return room.serviciosIncluidos.map(service => service.nombre).join(', ');
  }

  getAdditionalServices(room: Room): string {
    if (!room.serviciosAdicionales || room.serviciosAdicionales.length === 0) {
      return 'Ninguno';
    }
    return room.serviciosAdicionales.map(service => service.nombre).join(', ');
  }

  onRoomVerified(): void {
    this.loadInitialData();
  }
}
