import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';

import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { firstValueFrom, forkJoin } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { Room } from '../../../../shared/models/room';
import { User } from '../../../../shared/models/user';
import { RoomService } from '../../../../shared/services/room.service';
import { UserService } from '../../../profile/services/user.service';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    ProgressBarModule,
    TableModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    AccordionModule,
    RippleModule,
    AvatarModule,
    AvatarGroupModule,
    PanelModule,
    DividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  protected readonly Math = Math;
  protected readonly Object = Object;
  protected readonly Array = Array;

  rooms: Room[] = [];
  users: User[] = [];
  
  totalCities: number = 0;
  totalRooms: number = 0;
  totalUsers: number = 0;
  verifiedRooms: number = 0;
  
  roomsByCity: any = {};
  roomsByPriceRange: any = {};
  roomsByCapacity: any = {};
  usersByRole: any = {};
  
  loading: boolean = true;
  loadingCharts: boolean = true;
  
  cityChartData: any;
  cityChartOptions: any;
  
  priceChartData: any;
  priceChartOptions: any;
  
  userRoleChartData: any;
  userRoleChartOptions: any;
  
  constructor(
    private roomService: RoomService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupChartOptions();
  }

  async loadData(): Promise<void> {
    try {
      const { rooms, users } = await firstValueFrom(
        forkJoin({
          rooms: this.roomService.getRoomsWithServices(),
          users: this.userService.getAllUsers()
        })
      );

      this.rooms = rooms;
      this.users = users;
      
      this.calculateStatistics();
      
      this.prepareChartData();

      
      this.loading = false;
      this.loadingCharts = false;
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      this.loading = false;
      this.loadingCharts = false;
    }
  }

  calculateStatistics(): void {
    this.totalRooms = this.rooms.length;
    this.totalUsers = this.users.length;
    
    this.verifiedRooms = this.rooms.filter(room => room.verificada).length;

    this.roomsByCity = this.rooms.reduce((acc, room) => {
      acc[room.ciudad] = (acc[room.ciudad] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.totalCities = Object.keys(this.roomsByCity).length;

    const sortedCities = (Object.entries(this.roomsByCity) as [string, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.roomsByCity = Object.fromEntries(sortedCities);

    this.roomsByPriceRange = this.calculatePriceRanges(this.rooms);

    this.roomsByCapacity = this.rooms.reduce((acc, room) => {
      acc[room.capacidad] = (acc[room.capacidad] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    this.usersByRole = this.users.reduce((acc, user) => {
      acc[user.rol] = (acc[user.rol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  calculatePriceRanges(rooms: Room[]): Record<string, number> {
    const ranges: Record<string, number> = {
      '0-50': 0,
      '51-100': 0,
      '101-150': 0,
      '151-200': 0,
      '201+': 0
    };
    
    rooms.forEach(room => {
      const price = room.precioNoche;
      
      if (price <= 50) ranges['0-50']++;
      else if (price <= 100) ranges['51-100']++;
      else if (price <= 150) ranges['101-150']++;
      else if (price <= 200) ranges['151-200']++;
      else ranges['201+']++;
    });
    
    return ranges;
  }

  prepareChartData(): void {
    this.cityChartData = {
      labels: Object.keys(this.roomsByCity),
      datasets: [
        {
          data: Object.values(this.roomsByCity),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    };

    this.priceChartData = {
      labels: Object.keys(this.roomsByPriceRange),
      datasets: [
        {
          label: 'Habitaciones por precio (COP)',
          data: Object.values(this.roomsByPriceRange),
          backgroundColor: '#66BB6A',
          borderColor: '#43A047',
          borderWidth: 1
        }
      ]
    };
    
    this.userRoleChartData = {
      labels: Object.keys(this.usersByRole),
      datasets: [
        {
          data: Object.values(this.usersByRole),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }
      ]
    };
  }

  setupChartOptions(): void {
    const commonOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
    
    this.cityChartOptions = {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: ''
        }
      }
    };
    
    this.priceChartOptions = {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: 'Distribución por rango de precios'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de habitaciones'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Rango de precios (COP)'
          }
        }
      }
    };
    
    this.userRoleChartOptions = {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: {
          display: true,
          text: ''
        }
      }
    };
  }

  getRoomStatusTag(room: Room): { severity: TagSeverity; label: string } {
    if (room.verificada) {
      return { severity: 'success', label: 'Verificada' };
    } else {
      return { severity: 'warn', label: 'Pendiente' };
    }
  }

  getUserRoleTag(role: string): { severity: TagSeverity; label: string } {
    switch (role) {
      case 'ADMIN':
        return { severity: 'danger', label: 'Admin' };
      case 'PROPIETARIO':
        return { severity: 'warn', label: 'Propietario' };
      case 'CLIENTE':
      default:
        return { severity: 'info', label: 'Cliente' };
    }
  }

  getUserStatusTag(status: string): { severity: TagSeverity; label: string } {
    switch (status) {
      case 'ACTIVO':
        return { severity: 'success', label: 'Activo' };
      case 'INACTIVO':
        return { severity: 'danger', label: 'Inactivo' };
      default:
        return { severity: 'info', label: status };
    }
  }
}