import { CanActivateFn } from '@angular/router';

export const PermisosGuard: CanActivateFn = (route, state) => {
  return true;
};
