# 🤖 Gemini AI Chat Application

Aplikasi chat AI yang dibangun dengan **Ionic Angular** dan **Google Gemini API**. Aplikasi ini memiliki antarmuka yang modern dan interaktif untuk berkomunikasi dengan AI.

## ✨ Fitur

- 💬 Chat real-time dengan Gemini AI
- 🎨 Desain UI/UX yang modern dan menarik
- 📱 Responsive untuk berbagai ukuran layar
- ⚡ Auto-scroll ke pesan terbaru
- 🗑️ Hapus riwayat chat
- ⌨️ Kirim pesan dengan tombol Enter
- 🔄 Loading indicator saat AI memproses
- ❌ Error handling yang informatif

## 🚀 Cara Setup

### 1. Dapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik **"Create API Key"**
4. Copy API Key yang diberikan

### 2. Konfigurasi API Key

Buka file `src/environments/environment.ts` dan ganti `YOUR_GEMINI_API_KEY_HERE` dengan API Key Anda:

```typescript
export const environment = {
  production: false,
  geminiApiKey: 'PASTE_YOUR_API_KEY_HERE'
};
```

Jangan lupa juga update file `src/environments/environment.prod.ts` untuk production:

```typescript
export const environment = {
  production: true,
  geminiApiKey: 'PASTE_YOUR_API_KEY_HERE'
};
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Aplikasi

#### Development Mode
```bash
ionic serve
```

#### Build untuk Production
```bash
ionic build --prod
```

#### Run di Android
```bash
ionic capacitor add android
ionic capacitor run android
```

#### Run di iOS
```bash
ionic capacitor add ios
ionic capacitor run ios
```

## 📂 Struktur Project

```
src/
├── app/
│   ├── home/
│   │   ├── home.page.ts         # Logic halaman chat
│   │   ├── home.page.html       # Template UI chat
│   │   └── home.page.scss       # Styling aplikasi
│   ├── services/
│   │   └── gemini.service.ts    # Service untuk Gemini API
│   └── app.routes.ts
├── environments/
│   ├── environment.ts           # Config development
│   └── environment.prod.ts      # Config production
└── main.ts                      # Bootstrap aplikasi
```

## 🎨 Kustomisasi

### Mengubah Warna Tema

Edit file `src/app/home/home.page.scss` pada bagian gradient:

```scss
// Header gradient
--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// User message gradient
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// AI avatar gradient
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Mengubah Font Size

Sesuaikan ukuran font di `home.page.scss`:

```scss
.message-text {
  font-size: 15px; // Ubah sesuai keinginan
}
```

## 🔧 Troubleshooting

### Error: API Key tidak valid

- Pastikan Anda sudah memasukkan API Key yang benar
- Periksa apakah API Key masih aktif di Google AI Studio
- Pastikan tidak ada spasi atau karakter tambahan

### Error: CORS

Jika mengalami CORS error saat development:
- Gunakan proxy atau
- Test langsung di device/emulator

### Error: HttpClient not provided

Sudah ditangani dengan menambahkan `provideHttpClient()` di `main.ts`

## 📱 Screenshot

Aplikasi ini memiliki:
- Header dengan gradient ungu yang menarik
- Bubble chat dengan shadow dan rounded corners
- Avatar untuk user dan AI
- Animasi smooth saat pesan muncul
- Loading indicator dengan spinner
- Input field dengan design modern

## 🛠️ Teknologi yang Digunakan

- **Ionic Framework** v8
- **Angular** v18
- **Google Gemini API** (gemini-pro model)
- **TypeScript**
- **SCSS** untuk styling

## 📝 Catatan Penting

⚠️ **JANGAN commit API Key ke repository Git!**

Tambahkan file environment ke `.gitignore`:
```
# Environment files
/src/environments/*.ts
!/src/environments/*.example.ts
```

## 🤝 Kontribusi

Aplikasi ini dibuat untuk pembelajaran. Silakan modifikasi sesuai kebutuhan Anda!

## 📄 License

Free to use untuk tujuan pembelajaran.

---

**Selamat mencoba! 🚀**

Jika ada pertanyaan atau error, pastikan:
1. ✅ API Key sudah diisi dengan benar
2. ✅ Dependencies sudah terinstall (`npm install`)
3. ✅ Koneksi internet stabil
4. ✅ Node.js dan Ionic CLI sudah terinstall
