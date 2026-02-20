import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  
  // Data binding untuk form
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  // Method LOGIN
  async login() {
    console.log('🔑 Login button clicked');

    // Validasi input tidak kosong
    if (!this.username || !this.password) {
      this.showToast('Username dan Password harus diisi!', 'warning');
      return;
    }

    // Tampilkan loading spinner
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent'
    });
    await loading.present();

    // Kirim request login ke backend
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      // CALLBACK SUKSES
      next: async (response) => {
        console.log('✅ Login response:', response);
        
        // Tutup loading
        await loading.dismiss();

        // Simpan token ke storage
        await this.authService.setToken(response.token);

        // Simpan user info
        await this.authService.saveUserInfo({
          username: this.username,
          role: response.user?.role || 'MAHASISWA'
        });

        // Tampilkan toast sukses
        this.showToast('✅ Login Berhasil!', 'success');

        // Redirect ke home page
        this.router.navigate(['/home']);
      },

      // CALLBACK ERROR
      error: async (error) => {
        console.error('❌ Login error:', error);
        
        // Tutup loading
        await loading.dismiss();

        // Tampilkan pesan error
        const errorMessage = error.error?.error || 'Gagal login. Periksa koneksi Anda.';
        this.showToast(errorMessage, 'danger');
      }
    });
  }

  // Helper: Tampilkan Toast Notification
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}