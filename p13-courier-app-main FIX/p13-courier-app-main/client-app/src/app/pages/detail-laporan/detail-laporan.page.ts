import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../interfaces/models';
import * as L from 'leaflet';
import { addIcons } from 'ionicons';
import { personOutline, timeOutline, locationOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detail-laporan',
  templateUrl: './detail-laporan.page.html',
  styleUrls: ['./detail-laporan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailLaporanPage implements OnInit, OnDestroy {
  delivery: Delivery | null = null;
  map: L.Map | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private alertCtrl: AlertController, // Untuk Popup Konfirmasi
    private toastCtrl: ToastController, // Untuk Notifikasi
    private navCtrl: NavController      // Untuk kembali ke Home
  ) {
    addIcons({ personOutline, timeOutline, locationOutline, trashOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetail(Number(id));
    }
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  loadDetail(id: number) {
    this.deliveryService.getDeliveryDetail(id).subscribe({
      next: (res) => {
        this.delivery = res;
        setTimeout(() => {
          this.initMap();
        }, 500);
      },
      error: (err) => console.error(err)
    });
  }

  initMap() {
    if (!this.delivery) return;

    this.map = L.map('map-detail').setView([this.delivery.latitude, this.delivery.longitude], 16);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    }).addTo(this.map);

    L.marker([this.delivery.latitude, this.delivery.longitude])
      .addTo(this.map)
      .bindPopup(`<b>Lokasi Pengiriman</b><br>${this.delivery.customer_name}`)
      .openPopup();
  }

  // --- LOGIKA HAPUS DATA ---
  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Laporan?',
      message: 'Data yang dihapus tidak dapat dikembalikan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'confirm',
          handler: () => {
            this.deleteData();
          }
        }
      ]
    });
    await alert.present();
  }

  deleteData() {
    if (!this.delivery || !this.delivery.id) return;

    this.deliveryService.deleteDelivery(this.delivery.id).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Laporan berhasil dihapus.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        
        // Kembali ke halaman Home
        this.navCtrl.navigateBack('/home');
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Gagal menghapus data.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}