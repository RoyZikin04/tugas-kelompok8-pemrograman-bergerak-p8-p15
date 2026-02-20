const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// --- KEAMANAN SIBER: PROTEKSI ENDPOINT ---
// Hanya izinkan request dari Aplikasi Ionic (Port 8100)
const corsOptions = {
  // website-berbahaya.com
  origin: 'http://localhost:8100', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Simulasi Database - Data Barang Toko
let dataBarang = [
  { id: 1, nama_barang: 'Beras 5kg', harga: 65000 },
  { id: 2, nama_barang: 'Minyak Goreng 2L', harga: 35000 },
  { id: 3, nama_barang: 'Gula Pasir 1kg', harga: 15000 }
];

// --- ENDPOINT GET: Mengambil Semua Data Barang ---
app.get('/api/barang', (req, res) => {
  console.log('📥 Request GET diterima - Mengirim data barang');
  res.json(dataBarang);
});

// --- ENDPOINT POST: Menambah Barang Baru ---
app.post('/api/barang', (req, res) => {
  const barangBaru = req.body;
  
  // Generate ID unik menggunakan timestamp
  barangBaru.id = Date.now();
  
  // Tambahkan ke database
  dataBarang.push(barangBaru);
  
  console.log('📦 Barang baru ditambahkan:', barangBaru);
  console.log('📊 Total barang sekarang:', dataBarang.length);
  
  res.status(201).json({ 
    pesan: 'Barang berhasil ditambahkan!', 
    data: barangBaru 
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server Toko berjalan di http://localhost:${PORT}`);
  console.log(`✅ CORS aktif - Hanya menerima dari http://localhost:8100`);
});