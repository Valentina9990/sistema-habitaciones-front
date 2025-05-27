import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./components/admin-layout/admin-layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { UsersComponent } from "./pages/users/users.component";
import { RoomsComponent } from "./pages/rooms/rooms.component";
import { ReservationsComponent } from "./pages/reservations/reservations.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsersComponent },
      { path: 'habitaciones', component: RoomsComponent },
      { path: 'reservas', component: ReservationsComponent },
    ]
  }
];