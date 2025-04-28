import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { User } from '../../shared/models/user';
import { UserService } from './services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [ToastModule, SharedModule, AutoCompleteModule],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  currentUser: User | null = null;
  filteredUserTypes: any[] = [];
  userTypeOptions = [
    { label: 'Cliente', value: 'CLIENTE' },
    { label: 'Propietario', value: 'PROPIETARIO' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.minLength(6)]],
        confirmContrasena: [''],
        rol: [''],
      },
      {
        validators: [this.passwordMatchValidator],
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.profileForm.patchValue({
        nombre: this.currentUser.nombre,
        apellido: this.currentUser.apellido,
        correo: this.currentUser.correo,
        rol: this.getUserTypeByValue(this.currentUser.rol),
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la información del usuario',
      });
    }
  }

  getUserTypeByValue(value: string): any {
    return this.userTypeOptions.find((type) => type.value === value) || null;
  }

  filterUserTypes(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredUserTypes = this.userTypeOptions.filter((type) =>
      type.label.toLowerCase().includes(query)
    );
  }

  passwordMatchValidator(
    form: FormGroup
  ): { passwordMismatch: boolean } | null {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('confirmContrasena')?.value;

    if (password && (!confirmPassword || password !== confirmPassword)) {
      return { passwordMismatch: true };
    }
    return null;
  }

  isFormSubmittable(): boolean {
    if (this.profileForm.invalid) {
      return false;
    }
    const password = this.profileForm.get('contrasena')?.value;
    const confirmPassword = this.profileForm.get('confirmContrasena')?.value;
    if (password && password.trim() !== '') {
      return password === confirmPassword;
    }
    return true;
  }
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar al usuario',
      });
      return;
    }

    const rolValue =
      this.profileForm.value.rol?.value || this.profileForm.value.rol;

    this.userService.getUserById(this.currentUser.id).subscribe({
      next: (currentUserData) => {
        const userData: User = {
          id: this.currentUser!.id,
          nombre: this.profileForm.value.nombre,
          apellido: this.profileForm.value.apellido,
          correo: this.profileForm.value.correo,
          rol: rolValue,
          contrasena:
            this.profileForm.value.contrasena &&
            this.profileForm.value.contrasena.trim() !== ''
              ? this.profileForm.value.contrasena
              : currentUserData.contrasena,
        };

        this.loading = true;

        this.userService.updateUser(this.currentUser!.id, userData).subscribe({
          next: (updatedUser) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Perfil actualizado correctamente',
            });
            this.loading = false;

            this.profileForm.patchValue({
              contrasena: '',
              confirmContrasena: '',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.error || 'No se pudo actualizar el perfil',
            });
            this.loading = false;
          },
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información del usuario actual',
        });
      },
    });
  }
}
