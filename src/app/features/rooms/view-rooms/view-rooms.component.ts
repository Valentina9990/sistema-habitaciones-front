import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SharedModule } from '../../../shared/shared.module';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-view-rooms',
  imports: [NavbarComponent, SharedModule, AutoCompleteModule, DatePickerModule, InputNumberModule],
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

  minDate: Date = new Date();
  disabledDates: Date[] = [];

  constructor() { 
    this.checkInDate = new Date();
    this.checkOutDate = new Date(this.checkInDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    this.selectedCapacity = 1;
  }

  ngOnInit(): void {
    const today = new Date();
    this.checkInDate = today;
    this.checkOutDate = new Date(today.setDate(today.getDate() + 2));
  }

  searchRooms() {
    if (!this.selectedLocation || !this.checkInDate || !this.checkOutDate || !this.selectedCapacity) {
      alert('Please complete all fields');
      return;
    }

    if (this.checkOutDate <= this.checkInDate) {
      alert('Check-out date must be after check-in date');
      return;
    }
  }

  filterCities(event: AutoCompleteCompleteEvent) {
    if (event.query === '') {
      this.filteredCities = [...this.cities];
    } 
    else {
      this.filteredCities = this.cities.filter(city => 
        city.name.toLowerCase().includes(event.query.toLowerCase())
      );
    }
  }
}