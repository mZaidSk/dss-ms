import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  // Controls for the sidebar and user menu
  isSidebarOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  authUser: any;

  // Data for rendering user profile and menus (sample data)
  user = {
    profilePicture: 'https://example.com/user-photo.jpg',
    name: 'John Doe',
    email: 'john@example.com',
  };

  sidebarItems = [
    { name: 'Dashboard', link: '/dashboard', icon: 'pi pi-microsoft' },
    { name: 'Building', link: '/building', icon: 'pi pi-table' },
    { name: 'Watchmen', link: '/watchmen', icon: 'pi pi-user' },
    {
      name: 'Watchmen Assignments',
      link: '/watchmen-assignments',
      icon: 'pi pi-user-plus',
    },
    { name: 'Feedback', link: '/feedback', icon: 'pi pi-pencil' },
    { name: 'Alerts', link: '/alerts', icon: 'pi pi-bell' },
    // { name: 'ToDo', link: '/todo' },
    // { name: 'Settings', link: '/settings' },
    // { name: 'Messages', link: '/messages', badge: 3 }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.getAuthUser();
  }

  // Toggle sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Toggle user dropdown menu
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleLogout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
        console.log('Logged out!');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  }

  getAuthUser() {
    this.authService.getCurrentUser().subscribe((res) => {
      this.authUser = res;
      console.log(this.authUser);
    });
  }
}
