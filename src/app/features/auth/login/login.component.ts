import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false] // Remember me checkbox
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          // Navigate to the dashboard after successful login
          this.router.navigate(['/dashboard']);
        })
        .catch((error) => {
          // Handle login error
          console.log(error)
          this.errorMessage = "Invalid Login Credential";
        });
    }
  }


  // onRegister() {
  //   this.authService.register(this.email, this.password)
  //     .then(() => {
  //       console.log('Registered!');
  //     })
  //     .catch((error) => {
  //       console.error('Registration failed:', error);
  //     });
  // }

  // onLogout() {
  //   this.authService.logout()
  //     .then(() => {
  //       console.log('Logged out!');
  //     })
  //     .catch((error) => {
  //       console.error('Logout failed:', error);
  //     });
  // }
}
