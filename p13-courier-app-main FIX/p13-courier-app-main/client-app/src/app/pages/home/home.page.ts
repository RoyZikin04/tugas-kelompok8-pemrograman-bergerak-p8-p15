import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, trash, documentTextOutline } from 'ionicons/icons';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';
import { Delivery } from '../../interfaces/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomePage {
  deliveries: Delivery[] = [];
  user: any;

  constructor(
    private deliveryService: DeliveryService,
    private auth: AuthService,
    private router: Router, // Pastikan Router diimport
    private toast: ToastController
  ) {
    addIcons({ add, logOutOutline, trash, documentTextOutline });
  }

  ionViewWillEnter() {
    this.user = this.auth.getUser();
    this.loadData();
  }

  loadData(event?: any) {
    if (this.user) {
      this.deliveryService.getDeliveries(this.user.id).subscribe({
        next: (res) => {
          this.deliveries = res;
          if (event) event.target.complete();
        },
        error: () => {
          if (event) event.target.complete();
        }
      });
    }
  }

  refreshData(event: any) { 
    this.loadData(event); 
  }

  // [BARU] Fungsi Navigasi ke Detail
  openDetail(id: number) {
    this.router.navigate(['/detail-laporan', id]);
  }

  deleteItem(id: number) {
    this.deliveryService.deleteDelivery(id).subscribe(() => {
      this.loadData();
      this.showToast('Data dihapus', 'warning');
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 2000, color: color });
    t.present();
  }
}