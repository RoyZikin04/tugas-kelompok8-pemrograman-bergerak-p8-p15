import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard] 
  },
  { 
    path: 'form-laporan', 
    loadComponent: () => import('./pages/form-laporan/form-laporan.page').then(m => m.FormLaporanPage),
    canActivate: [authGuard] 
  },
  {
    path: 'detail-laporan/:id',
    loadComponent: () => import('./pages/detail-laporan/detail-laporan.page').then( m => m.DetailLaporanPage),
    canActivate: [authGuard]
  },
];