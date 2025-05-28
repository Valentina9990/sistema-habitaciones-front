import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}
  @Input() userType: 'owner' | 'tenant' = 'tenant';
  @Input() unreadNotifications: number = 3;

  profileMenuItems: MenuItem[] = [
    {
      label: 'Ver perfil',
      icon: 'pi pi-user',
      command: () => {
        this.router.navigate(['/profile']).catch(e => {
          console.error('Navigation error:', e);
        });
      }
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    },
    {
      label: 'Mis reservas',
      icon: 'pi pi-calendar',
      command: () => {
        this.router.navigate(['/profile/reservations']).catch(e => {
          console.error('Navigation error:', e);
        });
      }
    }
  ];
  

  showNotifications() {
    console.log("Mostrar notificaciones...");
  }

  logout() {
    this.authService.logout();
  }
  
}
