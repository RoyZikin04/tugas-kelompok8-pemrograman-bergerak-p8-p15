# GeoPatrol - Sistem Pelaporan Lapangan & Absensi Kurir

**Mata Kuliah:** Pemrograman Bergerak\
**Topik:** Camera, Geolocation, Google Maps (Leaflet), & Backend
Integration.

Project ini adalah aplikasi hybrid (Ionic) untuk pelaporan pengiriman
barang berbasis lokasi. Aplikasi memvalidasi laporan menggunakan Foto
Bukti (Kamera) dan Titik Koordinat (GPS) yang ditampilkan dalam Peta
Interaktif.

------------------------------------------------------------------------

## 🌟 Fitur Utama (Sesuai Kriteria Tugas)

1.  **Autentikasi Aman**
    -   Login & Register menggunakan JWT
    -   Password hashing menggunakan Bcrypt
2.  **Bukti Otentik**
    -   Laporan wajib menyertakan Foto (Kamera)
    -   Validasi lokasi menggunakan GPS
3.  **Visualisasi Peta**
    -   Menggunakan Leaflet.js (Tanpa API Key Berbayar)
4.  **CRUD Lengkap**
    -   Create: Input laporan baru
    -   Read: Riwayat & Detail laporan
    -   Delete: Hapus laporan
5.  **Challenge Features**
    -   Satellite View (Ganti layer Jalan/Satelit)
    -   Radius Alert (\>100 meter dari Monas)

------------------------------------------------------------------------

## 📂 Struktur Folder


- **server-geo/** → REST API untuk autentikasi dan pencatatan pengiriman  
- **client-app/** → Aplikasi mobile berbasis Ionic untuk input dan tracking lokasi  
- **README.md** → Dokumentasi setup, arsitektur, dan panduan penggunaan



------------------------------------------------------------------------

## 🚀 Cara Menjalankan (Quick Start)

Anda perlu menjalankan dua terminal secara bersamaan.

### Terminal 1: Backend Server
```bash
cd server-geo
npm install
node server.js
```
Server berjalan di: http://localhost:3000

### Terminal 2: Frontend Aplikasi
```bash
cd client-app
npm install
ionic serve
```
Aplikasi berjalan di: http://localhost:8100

**Catatan:** Pastikan database MySQL sudah diimport sebelum menjalankan
server.
