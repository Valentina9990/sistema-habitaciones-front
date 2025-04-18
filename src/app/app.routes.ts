import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ViewRoomsComponent } from './features/rooms/view-rooms/view-rooms.component';
import { RoomDetailComponent } from './features/rooms/room-detail/room-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rooms', component: ViewRoomsComponent },
  { path: 'rooms/:id', component: RoomDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }

];