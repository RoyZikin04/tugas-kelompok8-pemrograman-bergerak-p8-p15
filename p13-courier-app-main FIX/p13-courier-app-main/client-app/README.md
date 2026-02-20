# GeoPatrol Client (Ionic)

Aplikasi mobile hybrid untuk kurir melakukan pelaporan tugas. Mendukung
akses Kamera dan GPS di Browser maupun Android.

------------------------------------------------------------------------

## 📱 Fitur & Modul

### Pages

-   Login & Register
-   Home (Riwayat Pengiriman)
-   Form Laporan (Input + Foto + Map)
-   Detail Laporan (Foto + Map + Delete)

### Services

-   AuthService
-   DeliveryService

### Guards

-   AuthGuard

------------------------------------------------------------------------

## 🗺️ Implementasi Peta (Leaflet JS)

-   Menggunakan Leaflet sebagai alternatif Google Maps Native
-   Layer: OpenStreetMap & Esri World Imagery
-   Radius Alert 100 meter dari Monas (Hardcoded)
-   File logic: form-laporan.page.ts
-   Variabel yang bisa diubah: targetLat & targetLng

------------------------------------------------------------------------

## 💻 Testing di Browser
```bash
npm install
ionic serve
```

