import { Component, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Room } from '../../../shared/models/room';
import { SharedModule } from '../../../shared/shared.module';

import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs/operators';
import { Service } from '../../../shared/models/service';
import { RoomService } from '../../../shared/services/room.service';

@Component({
  selector: 'app-view-rooms',
  imports: [NavbarComponent, SharedModule, AutoCompleteModule, DatePickerModule, InputNumberModule, SliderModule, ProgressSpinnerModule, NgIf],
  templateUrl: './view-rooms.component.html',
  styleUrl: './view-rooms.component.scss'
})
export class ViewRoomsComponent implements OnInit {
  cities: any[] = [
    { name: 'Santa Marta', code: 'santa-marta' },
    { name: 'Cartagena', code: 'cartagena' },
    { name: 'Medellín', code: 'medellin' },
    { name: 'Bogotá', code: 'bogota' },
    { name: 'Cali', code: 'cali' }
  ];

  filteredCities: any[] = [];
  selectedLocation: any;
  checkInDate: Date;
  checkOutDate: Date;
  selectedCapacity: number;
  showResults = false;
  loading = false;

  priceRange: [number, number] = [100000, 200000];
  services: { id: number, name: string, selected: boolean, tipo: 'incluido' | 'adicional' }[] = [];
  
  filteredRooms: Room[] = [];
  allServices: Service[] = [];

  minDate: Date = new Date();
  disabledDates: Date[] = [];

  constructor(private roomService: RoomService) {
    this.checkInDate = new Date();
    this.checkOutDate = new Date(this.checkInDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    this.selectedCapacity = 1;
  }

  ngOnInit(): void {
    const today = new Date();
    this.checkInDate = today;
    this.checkOutDate = new Date(today.setDate(today.getDate() + 2));
  
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading = true;
    this.roomService.getRoomsWithServices()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (rooms) => {
          this.filteredRooms = rooms;
          this.extractAllServices(rooms);
        },
        error: (err) => console.error('Error loading rooms:', err)
      });
  }

  extractAllServices(rooms: Room[]) {
    const allServices = new Map<number, Service>();
    
    rooms.forEach(room => {
      [...room.serviciosIncluidos, ...room.serviciosAdicionales].forEach(service => {
        if (!allServices.has(service.id)) {
          allServices.set(service.id, service);
        }
      });
    });

    this.allServices = Array.from(allServices.values());
    this.services = this.allServices
      .filter(s => s.tipo === 'incluido' || s.tipo === 'adicional')
      .map(s => ({
        id: s.id,
        name: s.nombre,
        selected: false,
        tipo: s.tipo as 'incluido' | 'adicional'
      }));
  }

  searchRooms() {
    this.loading = true;
    this.showResults = true;
    
    const selectedServiceIds = this.services
      .filter(s => s.selected)
      .map(s => s.id);

    const filters = {
      ciudad: this.selectedLocation?.name,
      precioMin: this.priceRange[0],
      precioMax: this.priceRange[1],
      capacidad: this.selectedCapacity,
      servicios: selectedServiceIds
    };

    this.roomService.searchRooms(filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (rooms) => {
          this.filteredRooms = rooms
        },
        error: (err) => console.error('Error searching rooms:', err)
      });
  }

  filterCities(event: AutoCompleteCompleteEvent) {
    this.filteredCities = event.query === '' 
      ? [...this.cities] 
      : this.cities.filter(city => 
          city.name.toLowerCase().includes(event.query.toLowerCase())
        );
  }

  getIncludedServices(room: Room): string {
    return room.serviciosIncluidos?.map(s => s.nombre).join(', ') || 'No hay servicios incluidos';
  }

  getAdditionalServices(room: Room): string {
    const services = room.serviciosAdicionales?.map(s => 
      s.precio ? `${s.nombre} ($${s.precio})` : s.nombre
    );
    return services?.join(', ') || 'No hay servicios adicionales';
  }
}