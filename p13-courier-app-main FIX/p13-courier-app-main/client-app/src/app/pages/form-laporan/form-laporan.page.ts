import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { camera, send, mapOutline } from 'ionicons/icons';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-form-laporan',
  templateUrl: './form-laporan.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FormLaporanPage implements OnInit, OnDestroy {
  // Input Models
  noResi = '';
  customerName = '';
  photoBase64: string | null = null;
  latitude: number = 0;
  longitude: number = 0;

  // Map Variables
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  streetLayer: L.TileLayer | undefined;
  satelliteLayer: L.TileLayer | undefined;
  isSatellite = false;

  // Target Location (Home/Office)
  targetLat = -6.716077;
  targetLng = 108.492221; 
  distanceFromOffice: number | null = null;

  constructor(
    private deliveryService: DeliveryService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({ camera, send, mapOutline });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
      this.getCurrentLocation();
    }, 500);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  initMap() {
    this.map = L.map('map').setView([this.targetLat, this.targetLng], 15);

    this.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OSM'
    });

    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    });

    this.streetLayer.addTo(this.map);

    // Circle Area Jangkauan 100m
    L.circle([this.targetLat, this.targetLng], { 
      radius: 100, color: 'red', fillColor: '#f03', fillOpacity: 0.2 
    }).addTo(this.map).bindPopup("Radius Jangkauan (100m)");
  }

  toggleMapLayer() {
    if (!this.map || !this.streetLayer || !this.satelliteLayer) return;
    if (this.isSatellite) {
      this.map.removeLayer(this.satelliteLayer);
      this.streetLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.streetLayer);
      this.satelliteLayer.addTo(this.map);
    }
    this.isSatellite = !this.isSatellite;
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true,
        timeout: 10000 // Menunggu maksimal 10 detik
      });
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;

      this.updateMapMarker(this.latitude, this.longitude);
      this.checkDistance(this.latitude, this.longitude);
    } catch (e) {
      this.showToast('Gagal ambil lokasi GPS. Pastikan izin lokasi aktif.', 'danger');
    }
  }

  updateMapMarker(lat: number, lng: number) {
    if (!this.map) return;
    this.map.setView([lat, lng], 17);
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup("Posisi Anda").openPopup();
  }

  checkDistance(lat1: number, lon1: number) {
    const R = 6371e3; // Radius bumi meter
    const dLat = (this.targetLat - lat1) * Math.PI / 180;
    const dLon = (this.targetLng - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(this.targetLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    this.distanceFromOffice = R * c;

    // Radius testing diperluas menjadi 50km jika Anda tidak di lokasi
    if (this.distanceFromOffice > 50000) {
      this.showAlert("Peringatan Jarak", `Anda berada ${Math.floor(this.distanceFromOffice / 1000)} km dari target.`);
    }
  }

async takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 30,      // Kecilkan kualitas ke 30%
      width: 600,       // Paksa lebar foto jadi 600px saja (supaya ringan)
      resultType: CameraResultType.Base64, 
      source: CameraSource.Camera
    });
    this.photoBase64 = `data:image/jpeg;base64,${image.base64String}`;
  } catch (e) {
    console.log('Batal ambil foto');
  }
}

  async submitData() {
    // 1. Validasi Input
    if (!this.noResi || !this.customerName || !this.photoBase64) {
      return this.showToast('Data belum lengkap atau foto belum diambil!', 'warning');
    }

    // 2. Validasi Jarak (Set 50000 agar testing bisa lolos meskipun jauh)
    if (this.distanceFromOffice && this.distanceFromOffice > 50000) {
      return this.showAlert('Gagal', 'Lokasi Anda terlalu jauh dari jangkauan sistem.');
    }

    // 3. Validasi User Session
    const user = this.auth.getUser();
    if (!user || !user.id) {
      return this.showToast('Sesi berakhir, silakan login ulang', 'danger');
    }

    const loader = await this.loading.create({ message: 'Mengirim laporan...' });
    await loader.present();

    const payload = {
      user_id: user.id,
      no_resi: this.noResi,
      customer_name: this.customerName,
      photo_path: this.photoBase64,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.deliveryService.createDelivery(payload).subscribe({
      next: (res) => {
        loader.dismiss();
        this.showToast('Laporan Berhasil Terkirim!', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        loader.dismiss();
        console.error('Detail Error Server:', err);
        const errorMsg = err.error?.message || 'Gagal mengirim data ke server.';
        this.showToast(errorMsg, 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 2500, color: color });
    t.present();
  }

  async showAlert(header: string, msg: string) {
    const alert = await this.alertCtrl.create({ header, message: msg, buttons: ['OK'] });
    await alert.present();
  }
}