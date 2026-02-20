import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {
  
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  // Method REGISTER
  async register() {
    console.log('📝 Register button clicked');

    // Validasi input tidak kosong
    if (!this.username || !this.password || !this.confirmPassword) {
      this.showToast('Semua field harus diisi!', 'warning');
      return;
    }

    // Validasi username minimal 3 karakter
    if (this.username.length < 3) {
      this.showToast('Username minimal 3 karakter!', 'warning');
      return;
    }

    // Validasi password minimal 6 karakter
    if (this.password.length < 6) {
      this.showToast('Password minimal 6 karakter!', 'warning');
      return;
    }

    // Validasi password match
    if (this.password !== this.confirmPassword) {
      this.showToast('Password tidak cocok!', 'warning');
      return;
    }

    // Tampilkan loading
    const loading = await this.loadingCtrl.create({
      message: 'Mendaftar...',
      spinner: 'crescent'
    });
    await loading.present();

    // Kirim request register
    this.authService.register({
      username: this.username,
      password: this.password
    }).subscribe({
      // CALLBACK SUKSES
      next: async (response) => {
        console.log('✅ Register response:', response);
        
        await loading.dismiss();

        // Tampilkan toast sukses
        this.showToast('✅ Registrasi Berhasil! Silakan login.', 'success');

        // Redirect ke login page
        this.router.navigate(['/login']);
      },

      // CALLBACK ERROR
      error: async (error) => {
        console.error('❌ Register error:', error);
        
        await loading.dismiss();

        const errorMessage = error.error?.error || 'Gagal daftar. Username mungkin sudah digunakan.';
        this.showToast(errorMessage, 'danger');
      }
    });
  }

  // Helper: Tampilkan Toast
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}