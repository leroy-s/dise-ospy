// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const hasRole = allowedRoles.some(role =>
    authService.hasRole(role)
  );

  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
