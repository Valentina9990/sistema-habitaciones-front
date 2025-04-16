import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-navbar',
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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
    console.log("Cerrando sesión...");
  }
}
