import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor() { }

  // Register a new user
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // User registered successfully
        const user = userCredential.user;
        this.storeToken(user); // Store token after registration
      })
      .catch((error) => {
        console.error('Registration error:', error);
        throw error;
      });
  }

  // Login user
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // User logged in successfully
        const user = userCredential.user;
        this.storeToken(user); // Store token after login
      })
      .catch((error) => {
        console.error('Login error:', error);
        throw error;
      });
  }

  // Logout user
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        localStorage.removeItem(Constants.token); // Remove token on logout
        console.log('User logged out successfully');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }

  // Store token in local storage
  private storeToken(user: User): void {
    user.getIdToken().then((token) => {
      localStorage.setItem(Constants.token, token); // Store the token in local storage
    }).catch((error) => {
      console.error('Error getting token:', error);
    });
  }

  // Get the currently logged-in user
  getCurrentUser(): Observable<User | null> {
    return new Observable<User | null>(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        observer.next(user);
      });
      return { unsubscribe };
    });
  }
}
