import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'] as string;
  if (requiredRole && !authService.hasRole(requiredRole)) {
    console.warn(`Acceso denegado. Se requiere el rol: ${requiredRole}`);
    router.navigate(['/']);
    return false;
  }
  return true;
};