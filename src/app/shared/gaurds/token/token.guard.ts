import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const tokenGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // Use onAuthStateChanged to ensure Firebase fully loads the authentication state
  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await router.navigate(['/login']); // Redirect to login if no user is authenticated
        resolve(false);
      } else {
        const token = await user.getIdToken(false);

        if (!token) {
          await router.navigate(['/login']); // Redirect if the token is invalid
          resolve(false);
        } else {
          resolve(true); // Allow navigation if token is valid
        }
      }
    });
  });
};
