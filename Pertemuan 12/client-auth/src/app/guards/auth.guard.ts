import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Method yang dipanggil sebelum route dibuka
  async canActivate(): Promise<boolean> {
    console.log('🛡️ AuthGuard: Checking authentication...');
    
    // Cek apakah user sudah login
    const isLoggedIn = await this.authService.isLoggedIn();
    
    if (isLoggedIn) {
      console.log('✅ AuthGuard: User authenticated, access granted');
      return true; // Boleh akses halaman
    } else {
      console.log('❌ AuthGuard: User not authenticated, redirecting to login');
      
      // Redirect ke halaman login
      this.router.navigate(['/login']);
      return false; // Tolak akses
    }
  }
}