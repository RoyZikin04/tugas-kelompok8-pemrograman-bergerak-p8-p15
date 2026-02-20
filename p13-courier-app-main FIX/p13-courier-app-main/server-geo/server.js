/**
 * BACKEND SERVER - GEOPATROL
 * Stack: Express, MySQL, JWT, Bcrypt
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'rahasia_negara_api_key';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'db_geopatrol'
});

db.connect((err) => {
    if (err) console.error('❌ DB Error:', err);
    else console.log('✅ Connected to MySQL: db_geopatrol');
});

// Base Route
app.get('/', (req, res) => {
    res.send('Welcome to GeoPatrol API');
});

// --- AUTH ENDPOINTS ---

app.post('/api/auth/register', async (req, res) => {
    const { username, password, full_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Data tidak lengkap' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)', 
    [username, hashedPassword, full_name], (err, result) => {
        if (err) return res.status(400).json({ error: 'Username sudah ada' });
        res.json({ message: 'Registrasi berhasil' });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (results.length === 0) return res.status(401).json({ error: 'User tidak ditemukan' });
        
        const user = results[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ error: 'Password salah' });

        const token = jwt.sign({ id: user.id, name: user.full_name }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ message: 'Login sukses', token, user: { id: user.id, name: user.full_name } });
    });
});

// --- DELIVERY ENDPOINTS ---

// 1. Get All Deliveries
app.get('/api/deliveries/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('SELECT * FROM deliveries WHERE user_id = ? ORDER BY id DESC', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Get Single Delivery Detail
app.get('/api/deliveries/detail/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM deliveries WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(results[0]);
    });
});

// 3. Create Delivery
app.post('/api/deliveries', (req, res) => {
    const { user_id, no_resi, customer_name, photo_path, latitude, longitude } = req.body;
    
    const sql = `INSERT INTO deliveries (user_id, no_resi, customer_name, photo_path, latitude, longitude) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [user_id, no_resi, customer_name, photo_path, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Data tersimpan', id: result.insertId });
    });
});

// 4. Delete Delivery
app.delete('/api/deliveries/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM deliveries WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Data dihapus' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
