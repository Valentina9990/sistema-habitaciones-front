import { Component } from '@angular/core';
import { Service } from '../../../../shared/models/service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-upload-room',
  imports: [CommonModule, SharedModule, FileUploadModule, MultiSelectModule, InputNumberModule],
  providers: [MessageService],
  templateUrl: './upload-room.component.html',
  styleUrl: './upload-room.component.scss',
  standalone: true
})
export class UploadRoomComponent {
  roomData = {
    ciudad: '',
    direccion: '',
    capacidad: null,
    precioNoche: null,
    descripcion: '',
    propietarioId: 0,
    verificada: false,
    imagenes: [] as string[],
    servicios: [] as Service[]
  };

  availableServices: Service[] = [
    { id: 1, nombre: 'Wifi' },
    { id: 2, nombre: 'Aire acondicionado' },
    { id: 3, nombre: 'Piscina' },
    { id: 4, nombre: 'Gimnasio' },
    { id: 5, nombre: 'Parking' }
  ];

  uploadedFiles: any[] = [];
  loading = false;
  defaultImages = [
    'default-room-1.jpg',
    'default-room-2.jpg',
    'default-room-3.jpg'
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.setOwnerId();
  }

  private setOwnerId() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.roomData.propietarioId = currentUser.id;
    } else {
      console.error('No authenticated user');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes iniciar sesión para subir una habitación'
      });
    }
  }

  onSubmit() {
    if (this.roomData.propietarioId === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar al propietario'
      });
      return;
    }

    if (this.roomData.imagenes.length === 0) {
      this.roomData.imagenes = [...this.defaultImages];
      this.messageService.add({
        severity: 'info',
        summary: 'Información',
        detail: 'Se usarán imágenes por defecto para la habitación',
        life: 3000
      });
    }

    this.loading = true;
    
    this.http.post(`${environment.api.rooms}/api/rooms`, this.roomData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Habitación subida correctamente',
            life: 5000
          });
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la habitación',
            life: 5000
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      const fakeImageUrl = `uploaded-${Date.now()}-${file.name}`;
      this.roomData.imagenes.push(fakeImageUrl);
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Archivo subido',
      detail: 'Las imágenes se procesarán cuando envíes el formulario',
      life: 3000
    });
  }

  useDefaultImages() {
    this.roomData.imagenes = [...this.defaultImages];
    this.uploadedFiles = this.defaultImages.map(img => ({ name: img }));
    this.messageService.add({
      severity: 'info',
      summary: 'Imágenes por defecto',
      detail: 'Se han seleccionado imágenes por defecto para la habitación',
      life: 3000
    });
  }

  resetForm() {
    this.roomData = {
      ciudad: '',
      direccion: '',
      capacidad: null,
      precioNoche: null,
      descripcion: '',
      propietarioId: this.authService.getCurrentUser()?.id || 0,
      verificada: false,
      imagenes: [],
      servicios: []
    };
    this.uploadedFiles = [];
  }
}