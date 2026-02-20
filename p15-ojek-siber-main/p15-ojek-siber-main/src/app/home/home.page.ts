import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage {
  username = '';
  password = '';
  isFakeGPS = false;

  constructor(
    private http: HttpClient,
    private toast: ToastController,
  ) {}

  loginVulnerable() {
    const data = { username: this.username, password: this.password };
    this.http
      .post('http://localhost:3000/api/login-vulnerable', data)
      .subscribe({
        next: (res: any) => this.showToast(res.message, 'warning'),
        error: () => this.showToast('Login Gagal', 'danger'),
      });
  }

  loginSecure() {
    const data = { username: this.username, password: this.password };
    this.http.post('http://localhost:3000/api/login-secure', data).subscribe({
      next: (res: any) => this.showToast(res.message, 'success'),
      error: () => this.showToast('Login Gagal', 'danger'),
    });
  }

  kirimLokasi() {
    const payload = { lat: -6.73, lng: 108.55, isMock: this.isFakeGPS };
    this.http
      .post('http://localhost:3000/api/absen-lokasi', payload)
      .subscribe({
        next: (res: any) => this.showToast(res.message, 'primary'),
        error: (err) => this.showToast(err.error.message, 'danger'),
      });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 2000,
      color: color,
    });
    t.present();
  }
}
