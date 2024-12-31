import { Routes } from '@angular/router';
import { authGuard } from './shared/gaurds/auth/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { tokenGuard } from './shared/gaurds/token/token.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [authGuard],
    canActivateChild: [],
    loadChildren: () =>
      import('./features/auth/auth.module').then((mod) => mod.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [tokenGuard], // Both guards applied
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (mod) => mod.DashboardModule
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard', // Change here
        pathMatch: 'full', // It's good practice to use pathMatch to specify when to redirect
      },
      {
        path: 'building',
        loadChildren: () =>
          import('./features/building/building.module').then(
            (mod) => mod.BuildingModule
          ),
      },
      {
        path: 'watchmen',
        loadChildren: () =>
          import('./features/watchmen/watchmen.module').then(
            (mod) => mod.watchmenModule
          ),
      },
      {
        path: 'watchmen-assignments',
        loadChildren: () =>
          import(
            './features/watchmen-assignments/watchmen-assignments.module'
          ).then((mod) => mod.WatchmenAssignmentsModule),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('./features/feedback/feedback.module').then(
            (mod) => mod.FeedbackModule
          ),
      },
    ],
  },
];
