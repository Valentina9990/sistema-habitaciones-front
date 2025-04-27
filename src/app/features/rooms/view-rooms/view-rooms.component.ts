// import { Component, OnInit } from '@angular/core';
// import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
// import { SharedModule } from '../../../shared/shared.module';
// import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
// import { DatePickerModule } from 'primeng/datepicker';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { Room } from '../../../shared/models/room';
// import { SliderModule } from 'primeng/slider';
// import { MockDataService } from '../../../shared/services/mock-data.service';
// @Component({
//   selector: 'app-view-rooms',
//   imports: [NavbarComponent, SharedModule, AutoCompleteModule, DatePickerModule, InputNumberModule, SliderModule],
//   templateUrl: './view-rooms.component.html',
//   styleUrl: './view-rooms.component.scss'
// })
// export class ViewRoomsComponent implements OnInit {
//   cities: any[] = [
//     { name: 'Santa Marta', code: 'santa-marta' },
//     { name: 'Cartagena', code: 'cartagena' },
//     { name: 'Medellín', code: 'medellin' },
//     { name: 'Bogotá', code: 'bogota' },
//     { name: 'Cali', code: 'cali' }
//   ];

//   filteredCities: any[] = [];
//   selectedLocation: any;
//   checkInDate: Date;
//   checkOutDate: Date;
//   selectedCapacity: number;
//   showResults = false;

//   priceRange: [number, number] = [100000, 200000];
//   services = [
//     { name: 'Wi-Fi', selected: false },
//     { name: 'Aire acondicionado', selected: false },
//     { name: 'TV', selected: false },
//     { name: 'Baño privado', selected: false },
//     { name: 'Cama doble', selected: false }
//   ];
  
//   filteredRooms: Room[] = [];

//   minDate: Date = new Date();
//   disabledDates: Date[] = [];

//   constructor(private mockDataService: MockDataService) {
//     this.checkInDate = new Date();
//     this.checkOutDate = new Date(this.checkInDate.getTime() + 2 * 24 * 60 * 60 * 1000);
//     this.selectedCapacity = 1;
//   }
  

//   ngOnInit(): void {
//     const today = new Date();
//     this.checkInDate = today;
//     this.checkOutDate = new Date(today.setDate(today.getDate() + 2));
  
//     this.loadRoomsAndServices();
//   }
  
//   loadRoomsAndServices() {
//     this.mockDataService.getServices().subscribe(services => {
//       this.services = services.map((s: any) => ({ name: s.name, selected: false }));
  
//       this.mockDataService.getRooms().subscribe(rooms => {
//         this.filteredRooms = rooms.map((room: any) => ({
//           id: room.id,
//           city: room.city,
//           address: room.address,
//           capacity: room.capacity,
//           price: room.price,
//           description: room.description,
//           rating: room.rating,
//           services: services
//             .filter((service: any) => room.services.includes(service.id))
//             .map((service: any) => ({ name: service.name, provided: true })),
//           images: room.images || []
//         }));
//       });
//     });
//   }
  

//   searchRooms() {
//     this.showResults = true;
//     this.filterRooms();
//   }
  

//   filterCities(event: AutoCompleteCompleteEvent) {
//     if (event.query === '') {
//       this.filteredCities = [...this.cities];
//     } 
//     else {
//       this.filteredCities = this.cities.filter(city => 
//         city.name.toLowerCase().includes(event.query.toLowerCase())
//       );
//     }
//   }

//   filterRooms() {
//     this.filteredRooms = this.filteredRooms.filter(room => {
//       const priceMatch = room.price >= this.priceRange[0] && room.price <= this.priceRange[1];
      
//       let servicesMatch = true;
//       const selectedServices = this.services.filter(s => s.selected).map(s => s.name);
      
//       if (selectedServices.length > 0) {
//         servicesMatch = selectedServices.every(serviceName => 
//           room.services.some(s => s.name === serviceName && s.provided)
//         );
//       }
      
//       return priceMatch && servicesMatch;
//     });
//   }
  
// }