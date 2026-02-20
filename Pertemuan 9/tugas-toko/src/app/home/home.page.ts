import { Component, OnInit } from '@angular/core';
import { BarangService } from '../services/barang.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonInput, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonButton, 
    IonInput, 
    IonCard,
    IonCardHeader,
    IonCardTitle, 
    IonCardContent, 
    CommonModule, 
    FormsModule
  ],
})
export class HomePage implements OnInit {
  // Variabel untuk menyimpan data
  listBarang: any[] = [];
  namaBarang = '';
  hargaBarang: number | null = null;

  constructor(private barangService: BarangService) {}

  // Dipanggil saat halaman pertama kali dibuka
  ngOnInit() {
    this.ambilDataBarang();
  }

  // Fungsi untuk mengambil data dari server
  ambilDataBarang() {
    this.barangService.getBarang().subscribe({
      next: (response) => {
        this.listBarang = response;
        console.log('✅ Data barang berhasil diambil:', response);
      },
      error: (error) => {
        console.error('❌ Error saat mengambil data:', error);
        alert('Gagal mengambil data. Pastikan server berjalan!');
      }
    });
  }

  // Fungsi untuk mengirim data barang baru ke server
  simpanBarang() {
    // Validasi: Pastikan input tidak kosong
    if (!this.namaBarang || !this.hargaBarang) {
      alert('Nama barang dan harga harus diisi!');
      return;
    }

    // Buat object data yang akan dikirim
    const dataBarang = {
      nama_barang: this.namaBarang,
      harga: this.hargaBarang
    };

    // Kirim ke server menggunakan service
    this.barangService.tambahBarang(dataBarang).subscribe({
      next: (response) => {
        console.log('✅ Barang berhasil ditambahkan:', response);
        alert('Barang berhasil disimpan!');
        
        // Reset form
        this.namaBarang = '';
        this.hargaBarang = null;
        
        // Refresh data barang
        this.ambilDataBarang();
      },
      error: (error) => {
        console.error('❌ Error saat menyimpan:', error);
        alert('Gagal menyimpan data. Cek console untuk detail error.');
      }
    });
  }

  // Fungsi untuk format harga ke Rupiah
  formatRupiah(angka: number): string {
    return 'Rp ' + angka.toLocaleString('id-ID');
  }
}