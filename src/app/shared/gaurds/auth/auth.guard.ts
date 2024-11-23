import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  // Return a Promise to wait for the auth state to change
  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If the user is already logged in, redirect them from the login page
        await router.navigate(['']); // Adjust the redirect path as needed
        resolve(false);
      } else {
        resolve(true); // Allow navigation if not logged in
      }
    });
  });
};
