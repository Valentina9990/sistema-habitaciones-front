import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}
  @Input() userType: 'owner' | 'tenant' = 'tenant';
  @Input() unreadNotifications: number = 3;

  profileMenuItems: MenuItem[] = [
    {
      label: 'Ver perfil',
      icon: 'pi pi-user',
      routerLink: '/profile'
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  showNotifications() {
    console.log("Mostrar notificaciones...");
  }

  logout() {
    this.router.navigate(['/login']); 
    console.log("Cerrando sesión...");
  }
}
