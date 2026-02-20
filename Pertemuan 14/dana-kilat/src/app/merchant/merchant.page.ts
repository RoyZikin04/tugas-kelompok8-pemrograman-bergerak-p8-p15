import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-merchant',
  templateUrl: 'merchant.page.html',
  styleUrls: ['merchant.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeComponent],
})
export class MerchantPage {
  merchantName: string = '';
  harga: number | null = null;
  qrData: string = '';
  qrGenerated: boolean = false;

  constructor(private toastCtrl: ToastController) {}

  generateQR() {
    if (!this.merchantName || !this.harga || this.harga <= 0) {
      this.tampilkanToast('Isi nama merchant dan nominal!', 'warning');
      return;
    }
    this.qrData = JSON.stringify({ merchant: this.merchantName, harga: this.harga });
    this.qrGenerated = true;
    this.tampilkanToast('QR berhasil dibuat!', 'success');
  }

  resetQR() {
    this.qrData = '';
    this.qrGenerated = false;
    this.merchantName = '';
    this.harga = null;
  }

  async tampilkanToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    toast.present();
  }
}