// Mengambil library yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Inisiasi aplikasi Express
const app = express();

// Middleware (penengah)
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Agar server bisa membaca format JSON
// Mengizinkan frontend mengakses file di dalam folder 'uploads'
app.use('/uploads', express.static('uploads'));

// -- Routes produk dan transaksi --
const produkRoutes = require('./routes/produkRoutes');
app.use('/api/produk', produkRoutes);

const transaksiRoutes = require('./routes/transaksiRoutes');
app.use('/api/transaksi', transaksiRoutes);
// -----------------------------
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Menyambungkan ke MongoDB menggunakan Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Berhasil terhubung ke MongoDB!'))
  .catch((err) => console.error('❌ Gagal terhubung ke database:', err));

// Rute tes sederhana
app.get('/', (req, res) => {
  res.send('Server Kasir API Berjalan Lancar!');
});

// Menyalakan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});