import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../profile/services/user.service';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  allUsers: User[] = [];
  displayedUsers: User[] = [];
  clonedUsers: { [s: string]: User } = {};
  
  first = 0;
  rows = 10;
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.totalRecords = users.length;
        this.displayedUsers = users;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudieron cargar los usuarios' 
        });
        this.loading = false;
      }
    });
  }

  onRowEditInit(user: User) {
    this.clonedUsers[user.id.toString()] = {...user};
  }

  onRowEditSave(user: User) {
    this.userService.updateUser(user.id, user).subscribe({
      next: (updatedUser) => {
        const indexAll = this.allUsers.findIndex(u => u.id === user.id);
        if (indexAll !== -1) {
          this.allUsers[indexAll] = updatedUser;
        }
        
        const indexDisplayed = this.displayedUsers.findIndex(u => u.id === user.id);
        if (indexDisplayed !== -1) {
          this.displayedUsers[indexDisplayed] = updatedUser;
        }
        
        delete this.clonedUsers[user.id.toString()];
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Usuario actualizado' 
        });
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al actualizar usuario' 
        });
      }
    });
  }

  onRowEditCancel(user: User, index: number) {
    this.displayedUsers[index] = this.clonedUsers[user.id.toString()];
    delete this.clonedUsers[user.id.toString()];
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  getUserStatusSeverity(status: string): "info" | "danger" | undefined {
    return status === 'activo' ? 'info' : 'danger';
  }
}