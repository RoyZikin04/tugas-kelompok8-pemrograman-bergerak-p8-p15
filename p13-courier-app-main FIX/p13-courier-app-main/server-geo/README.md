# GeoPatrol Backend API

Server REST API yang menangani autentikasi user, penyimpanan data
laporan, dan upload gambar (Base64).

------------------------------------------------------------------------

## 🛠️ Teknologi

-   Node.js & Express
-   MySQL
-   Bcrypt
-   JWT (JSON Web Token)
-   Body-Parser (limit 50mb)

------------------------------------------------------------------------

## ⚙️ Persiapan Database

1.  Pastikan MySQL (XAMPP / Laragon) berjalan.
2.  Buat database bernama: db_geopatrol
3.  Jalankan query berikut:

CREATE DATABASE IF NOT EXISTS db_geopatrol; USE db_geopatrol;

CREATE TABLE IF NOT EXISTS users ( id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL,
full_name VARCHAR(100) );

CREATE TABLE IF NOT EXISTS deliveries ( id INT AUTO_INCREMENT PRIMARY
KEY, user_id INT NOT NULL, no_resi VARCHAR(50) NOT NULL, customer_name
VARCHAR(100) NOT NULL, photo_path LONGTEXT NOT NULL, latitude DOUBLE NOT
NULL, longitude DOUBLE NOT NULL, status VARCHAR(20) DEFAULT 'Terkirim',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id)
REFERENCES users(id) ON DELETE CASCADE );

------------------------------------------------------------------------

## 🔌 Dokumentasi Endpoint

### A. Autentikasi

POST /api/auth/register\
Body: { username, password, full_name }

POST /api/auth/login\
Body: { username, password }

### B. Deliveries

GET /api/deliveries/:userId\
GET /api/deliveries/detail/:id\
POST /api/deliveries\
DELETE /api/deliveries/:id

------------------------------------------------------------------------

## ▶️ Cara Menjalankan

npm install\
node server.js

Server berjalan di http://localhost:3000
