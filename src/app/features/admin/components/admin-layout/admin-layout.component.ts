import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    SidebarComponent,
    SidebarModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  sidebarVisible: boolean = true;
  
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}