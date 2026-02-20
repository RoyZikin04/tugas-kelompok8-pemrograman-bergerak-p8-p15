import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonContent, 
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  AlertController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  shieldCheckmark, 
  person, 
  lockClosed, 
  key, 
  time, 
  shield,
  eye,
  logOut,
  logOutOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonBadge
  ],
})
export class HomePage implements OnInit {
  
  username: string = '';
  role: string = '';
  tokenPreview: string = '';
  loginTime: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    // Register icons
    addIcons({
      'shield-checkmark': shieldCheckmark,
      'person': person,
      'lock-closed': lockClosed,
      'key': key,
      'time': time,
      'shield': shield,
      'eye': eye,
      'log-out': logOut,
      'log-out-outline': logOutOutline
    });
  }

  async ngOnInit() {
    console.log('🏠 Home page loaded');
    await this.loadUserData();
  }

  async loadUserData() {
    try {
      const userInfo = await this.authService.getUserInfo();
      
      if (userInfo) {
        this.username = userInfo.username || 'User';
        this.role = userInfo.role || 'MAHASISWA';
        console.log('✅ User data loaded:', userInfo);
      }

      const token = await this.authService.getToken();
      
      if (token) {
        this.tokenPreview = token.substring(0, 30) + '...';
        this.decodeTokenExpiry(token);
      }

      this.loginTime = new Date().toLocaleString('id-ID');

    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  }

  decodeTokenExpiry(token: string) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      if (decoded.exp) {
        const expiryDate = new Date(decoded.exp * 1000);
        console.log('🕐 Token expires at:', expiryDate.toLocaleString('id-ID'));
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  async doLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Ya, Logout',
          handler: async () => {
            console.log('🚪 Logging out...');
            await this.authService.logout();
            console.log('✅ Logout successful');
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  async refreshData(event: any) {
    console.log('🔄 Refreshing data...');
    await this.loadUserData();
    event.target.complete();
  }

  async showFullToken() {
    const token = await this.authService.getToken();
    
    const alert = await this.alertCtrl.create({
      header: 'Full JWT Token',
      message: token || 'Token not found',
      buttons: ['OK']
    });

    await alert.present();
  }
}