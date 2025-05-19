import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./components/admin-layout/admin-layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { UsersComponent } from "./pages/users/users.component";
import { RoomsComponent } from "./pages/rooms/rooms.component";
import { ReviewsComponent } from "./pages/reviews/reviews.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'reviews', component: ReviewsComponent },
    ]
  }
];