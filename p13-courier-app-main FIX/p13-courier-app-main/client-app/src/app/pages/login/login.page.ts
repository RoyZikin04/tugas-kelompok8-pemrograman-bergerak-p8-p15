import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  username = ''; password = '';

  constructor(private auth: AuthService, private router: Router, private toast: ToastController) {}

  onLogin() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveSession(res.token, res.user);
        this.router.navigate(['/home']);
      },
      error: async () => {
        const t = await this.toast.create({ message: 'Login Gagal', duration: 2000, color: 'danger' });
        t.present();
      }
    });
  }
}