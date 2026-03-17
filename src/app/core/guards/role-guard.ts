import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { RoleAccessService } from '../services/role-access.service';
import { firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const roleService = inject(RoleAccessService);
  const router = inject(Router);

  const reqScreenId = route.data['screenId'] as string;
  const userRole = authService.getRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // System Admin bypass
  if (userRole === 'SYSTEM_ADMIN') {
    return true;
  }

  // If no specific screen restrictions assigned to this route
  if (!reqScreenId) {
    return true;
  }

  try {
    const roleAccess = await firstValueFrom(roleService.getRoleByName(userRole));
    if (roleAccess && roleAccess.accessConfigJson) {
      const allowedScreens: string[] = JSON.parse(roleAccess.accessConfigJson);
      if (allowedScreens.includes(reqScreenId)) {
        return true;
      }
    }
  } catch (err) {
    console.error('RoleGuard validation error:', err);
  }

  // Fallback: unauthorized
  console.warn(`User ${userRole} attempted to access unauthorized screen: ${reqScreenId}`);
  router.navigate(['/app/dashboard']); // Kick back to safe zone
  return false;
};
