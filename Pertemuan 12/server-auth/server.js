const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inisialisasi Express app
const app = express();

// Middleware
app.use(cors()); // Allow request dari frontend
app.use(bodyParser.json()); // Parse JSON body

// Secret key untuk JWT (GANTI dengan string random yang panjang di production!)
const SECRET_KEY = "kunci_rahasia_akses_jwt_2024";

// 1. KONEKSI DATABASE MYSQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Kosongkan jika default Laragon
    database: 'db_tugas'
});

// Test koneksi database
db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// 2. ENDPOINT REGISTER - Mendaftar Akun Baru
app.post('/api/register', async (req, res) => {
    try {
        // Ambil data dari request body
        const { username, password } = req.body;
        
        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username dan password harus diisi!' 
            });
        }

        // Validasi panjang password minimal 6 karakter
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password minimal 6 karakter!' 
            });
        }

        console.log(`📝 Register attempt: ${username}`);

        // ENKRIPSI PASSWORD dengan Bcrypt
        // Parameter 10 = cost factor (semakin tinggi, semakin aman tapi lambat)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log(`🔒 Password encrypted: ${password} -> ${hashedPassword.substring(0, 20)}...`);

        // Simpan ke database
        const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
        
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                // Error biasanya karena username sudah ada (UNIQUE constraint)
                console.error('❌ Register error:', err.message);
                return res.status(400).json({ 
                    error: 'Username sudah digunakan!' 
                });
            }

            console.log(`✅ User registered successfully: ${username} (ID: ${result.insertId})`);
            
            res.status(201).json({ 
                message: 'Registrasi Berhasil!',
                userId: result.insertId 
            });
        });

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. ENDPOINT LOGIN - Autentikasi User
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username dan password harus diisi!' 
            });
        }

        console.log(`🔑 Login attempt: ${username}`);

        // Cari user di database berdasarkan username
        const sql = 'SELECT * FROM users WHERE username = ?';
        
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('❌ Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Cek apakah user ditemukan
            if (results.length === 0) {
                console.log(`❌ User not found: ${username}`);
                return res.status(401).json({ 
                    error: 'Username tidak ditemukan!' 
                });
            }

            const user = results[0];

            // VALIDASI PASSWORD
            // bcrypt.compare akan hash password input dan bandingkan dengan hash di DB
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                console.log(`❌ Invalid password for: ${username}`);
                return res.status(401).json({ 
                    error: 'Password salah!' 
                });
            }

            console.log(`✅ Password valid for: ${username}`);

            // GENERATE JWT TOKEN
            // Payload: data yang akan disimpan di token
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role || 'MAHASISWA'
            };

            // Sign token dengan SECRET_KEY
            const token = jwt.sign(
                payload,
                SECRET_KEY,
                { expiresIn: '1h' } // Token berlaku 1 jam
            );

            console.log(`✅ JWT token generated for: ${username}`);
            console.log(`   Token preview: ${token.substring(0, 30)}...`);

            // Kirim response dengan token
            res.json({
                message: 'Login Sukses',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role || 'MAHASISWA'
                }
            });
        });

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. MIDDLEWARE - Verifikasi JWT Token

// Fungsi ini bisa digunakan untuk protect endpoint lain
function verifyToken(req, res, next) {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token tidak ditemukan!' });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Simpan user info ke request object
        req.user = decoded;
        
        // Lanjutkan ke route handler
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({ 
            error: 'Token tidak valid atau sudah expired!' 
        });
    }
}


// 5. ENDPOINT PROTECTED - Contoh Penggunaan Middleware

app.get('/api/profile', verifyToken, (req, res) => {
    // Endpoint ini hanya bisa diakses dengan token valid
    res.json({
        message: 'Profile data',
        user: req.user
    });
});


// 6. TEST ENDPOINT - Cek Server Running

app.get('/', (req, res) => {
    res.json({ 
        message: 'Server Auth berjalan dengan baik!',
        endpoints: {
            register: 'POST /api/register',
            login: 'POST /api/login',
            profile: 'GET /api/profile (protected)'
        }
    });
});


// 7. START SERVER

const PORT = 3000;
app.listen(PORT, () => {
    console.log('🚀 Server Auth Running!');
    console.log(`📍 URL: http://localhost:${PORT}`);
});