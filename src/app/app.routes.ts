import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ViewRoomsComponent } from './features/rooms/view-rooms/view-rooms.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './shared/guards/auth.guard';
import { RoomDetailComponent } from './features/rooms/room-detail/room-detail.component';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { RoomVerificationComponent } from './features/room-verification/room-verification.component';
import { ReservationComponent } from './features/reservation/reservation.component';
import { ReservationsListComponent } from './features/profile/reservations-list/reservations-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'rooms', component: ViewRoomsComponent },
  { path: 'admin', children: ADMIN_ROUTES },
  {
    path: 'profile/reservations',
    component: ReservationsListComponent
  },
  { path: 'rooms/verification', component: RoomVerificationComponent},
  { path: 'rooms/:id', component: RoomDetailComponent },
  { path: 'reservation/:roomId', component: ReservationComponent },
  { path: '', redirectTo: '/rooms', pathMatch: 'full' },
  { path: '**', redirectTo: '/rooms' }
];