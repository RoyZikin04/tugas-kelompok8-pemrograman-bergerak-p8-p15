import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Interface lokal untuk data form register (Type Safe)
interface RegisterPayload {
  username: string;
  password: string;
  full_name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {

  // Model data form (inisialisasi kosong)
  registerData: RegisterPayload = {
    username: '',
    password: '',
    full_name: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async onRegister() {
    // 1. Validasi Input Dasar
    if (!this.registerData.username || !this.registerData.password || !this.registerData.full_name) {
      this.showToast('Mohon lengkapi semua kolom!', 'warning');
      return;
    }

    if (this.registerData.password.length < 6) {
      this.showToast('Password minimal 6 karakter!', 'warning');
      return;
    }

    // 2. Tampilkan Loading
    const loading = await this.loadingCtrl.create({
      message: 'Mendaftarkan akun...',
      spinner: 'circles'
    });
    await loading.present();

    // 3. Panggil API Register
    this.authService.register(this.registerData).subscribe({
      next: async () => {
        await loading.dismiss();
        
        // Jika sukses, beri notifikasi dan arahkan ke Login
        this.showToast('Registrasi Berhasil! Silakan Login.', 'success');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loading.dismiss();
        
        // Handle error (misal: Username sudah ada)
        console.error(err);
        const pesanError = err.error?.error || 'Gagal mendaftar. Coba lagi.';
        this.showToast(pesanError, 'danger');
      }
    });
  }

  // Helper untuk menampilkan Toast
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}