import { Component, NgZone, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  saldo = 100000;
  history: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private zone: NgZone  // ← TAMBAHAN
  ) {}

  ngOnInit() {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
  }

  async scanQR() {
    const konfirmasi = await this.alertCtrl.create({
      header: 'Mulai Scan?',
      message: 'Pastikan kamera sudah diizinkan.',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { text: 'Scan Sekarang', handler: () => { this.mulaiScan(); } }
      ]
    });
    await konfirmasi.present();
  }

  async mulaiScan() {
    try {
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const minta = await BarcodeScanner.requestPermissions();
        if (minta.camera !== 'granted') {
          this.tampilkanToast('Izin kamera ditolak! Buka Pengaturan → Izin → Kamera', 'danger');
          return;
        }
      }

      document.querySelector('body')?.classList.add('barcode-scanner-active');
      const { barcodes } = await BarcodeScanner.scan();
      document.querySelector('body')?.classList.remove('barcode-scanner-active');

      if (barcodes.length > 0 && barcodes[0].rawValue) {
        this.prosesPembayaran(barcodes[0].rawValue);
      } else {
        this.tampilkanToast('Tidak ada QR terdeteksi', 'warning');
      }
    } catch (error: any) {
      document.querySelector('body')?.classList.remove('barcode-scanner-active');
      this.tampilkanToast('Error: ' + (error?.message || 'Gagal scan'), 'danger');
    }
  }

  async prosesPembayaran(rawData: string) {
    let merchantName = 'Unknown';
    let bayar = 0;
    try {
      const qrPayload = JSON.parse(rawData);
      merchantName = qrPayload.merchant || 'Unknown';
      bayar = Number(qrPayload.harga) || 0;
      if (bayar <= 0) { this.tampilkanToast('Data QR tidak valid!', 'warning'); return; }
    } catch (e) {
      this.tampilkanToast('Format QR tidak dikenali!', 'danger'); return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Pembayaran',
      message: `Merchant: <strong>${merchantName}</strong><br/>
                Tagihan: <strong>Rp ${bayar.toLocaleString('id-ID')}</strong><br/><br/>
                Saldo kamu: Rp ${this.saldo.toLocaleString('id-ID')}`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Bayar',
          handler: () => {
            // Bungkus zone.run() agar Angular mendeteksi perubahan array
            this.zone.run(() => this.eksekusiBayar(merchantName, bayar));
          }
        },
      ],
    });
    await alert.present();
  }

  eksekusiBayar(merchantName: string, bayar: number) {
    if (this.saldo >= bayar) {
      this.saldo -= bayar;
      this.history.unshift({
        merchant: merchantName,
        waktu: new Date().toLocaleTimeString('id-ID'),
        nominal: bayar,
      });
      this.tampilkanToast('✅ Berhasil bayar ke ' + merchantName, 'success');
    } else {
      this.tampilkanToast('❌ Saldo tidak cukup!', 'danger');
    }
  }

  async tampilkanToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 3000, color, position: 'top',
    });
    toast.present();
  }
}