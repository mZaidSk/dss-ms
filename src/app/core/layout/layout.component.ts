import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  // Controls for the sidebar and user menu
  isSidebarOpen: boolean = false;
  isUserMenuOpen: boolean = false;

  // Data for rendering user profile and menus (sample data)
  user = {
    profilePicture: 'https://example.com/user-photo.jpg',
    name: 'John Doe',
    email: 'john@example.com'
  };

  userMenuItems = [
    { name: 'Profile', link: '/profile' },
    { name: 'Settings', link: '/settings' },
  ];

  sidebarItems = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Building', link: '/building' },
    { name: 'watchmen', link: '/watchmen' },
    // { name: 'ToDo', link: '/todo' },
    // { name: 'Settings', link: '/settings' },
    // { name: 'Messages', link: '/messages', badge: 3 }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  // Toggle sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Toggle user dropdown menu
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleLogout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
        console.log('Logged out!');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }
}
