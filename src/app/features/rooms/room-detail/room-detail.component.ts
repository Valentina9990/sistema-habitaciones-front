// import { Component } from '@angular/core';
// import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
// import { SharedModule } from '../../../shared/shared.module';
// import { Room } from '../../../shared/models/room';
// import { GalleriaModule } from 'primeng/galleria';
// import { ActivatedRoute } from '@angular/router';
// import { MockDataService } from '../../../shared/services/mock-data.service';

// @Component({
//   selector: 'app-room-detail',
//   imports: [NavbarComponent, SharedModule, GalleriaModule],
//   templateUrl: './room-detail.component.html',
//   styleUrl: './room-detail.component.scss'
// })
// export class RoomDetailComponent {
//   room?: Room;

//   constructor(
//     private route: ActivatedRoute,
//     private roomService: MockDataService
//   ) {}

//   ngOnInit(): void {
//     const roomId = this.route.snapshot.paramMap.get('id');
//     if (roomId) {
//       this.loadRoomDetails(roomId);
//     }
//   }

//   loadRoomDetails(roomId: string): void {
//     this.roomService.getRoomById(roomId).subscribe(room => {
//       this.room = room;
//     });
//   }
// }
