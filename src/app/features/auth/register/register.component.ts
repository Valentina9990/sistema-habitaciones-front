import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  userTypes = [
    { name: 'Propietario', value: 'PROPIETARIO' },
    { name: 'Cliente', value: 'CLIENTE' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      userType: ['PROPIETARIO', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { 
      validators: [this.passwordMatchValidator]
    } as AbstractControlOptions);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    return password?.value === confirmPassword?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid && this.registerForm.value.acceptTerms) {
      this.loading = true;
      this.errorMessage = null;
      
      const formValue = this.registerForm.value;
      const registerData = {
        nombre: formValue.firstName,
        apellido: formValue.lastName,
        correo: formValue.email,
        contrasena: formValue.password,
        rol: formValue.userType
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']); 
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error en el registro. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }
}