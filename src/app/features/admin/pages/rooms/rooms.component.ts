import { Component, OnInit } from '@angular/core';
import { Room } from '../../../../shared/models/room';
import { RoomService } from '../../../../shared/services/room.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    RouterModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  allRooms: Room[] = [];
  displayedRooms: Room[] = [];
  clonedRooms: { [s: string]: Room } = {};
  
  first = 0;
  rows = 10;
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    private roomService: RoomService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAllRooms();
  }

  loadAllRooms() {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.allRooms = rooms;
        this.totalRecords = rooms.length;
        this.displayedRooms = rooms;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las habitaciones'
        });
        this.loading = false;
      }
    });
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onRowEditInit(room: Room) {
    this.clonedRooms[room.id.toString()] = {...room};
  }

  onRowEditSave(room: Room) {
    this.roomService.updateRoom(room.id, {
      ciudad: room.ciudad,
      direccion: room.direccion,
      capacidad: room.capacidad,
      precioNoche: room.precioNoche,
      verificada: room.verificada
    }).subscribe({
      next: (updatedRoom) => {
        const indexAll = this.allRooms.findIndex(r => r.id === room.id);
        if (indexAll !== -1) {
          this.allRooms[indexAll] = updatedRoom;
        }
        
        const indexDisplayed = this.displayedRooms.findIndex(r => r.id === room.id);
        if (indexDisplayed !== -1) {
          this.displayedRooms[indexDisplayed] = updatedRoom;
        }
        
        delete this.clonedRooms[room.id.toString()];
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Habitación actualizada correctamente'
        });
      },
      error: (err) => {
        const originalRoom = this.clonedRooms[room.id.toString()];
        const indexAll = this.allRooms.findIndex(r => r.id === room.id);
        if (indexAll !== -1 && originalRoom) {
          this.allRooms[indexAll] = originalRoom;
        }
        
        const indexDisplayed = this.displayedRooms.findIndex(r => r.id === room.id);
        if (indexDisplayed !== -1 && originalRoom) {
          this.displayedRooms[indexDisplayed] = originalRoom;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la habitación'
        });
      }
    });
  }

  onRowEditCancel(room: Room, index: number) {
    this.displayedRooms[index] = this.clonedRooms[room.id.toString()];
    delete this.clonedRooms[room.id.toString()];
  }

  getRoomVerificationSeverity(verificada: boolean): "success" | "warn" | undefined {
    return verificada ? 'success' : 'warn';
  }
}
