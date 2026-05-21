const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Ambil semua user (untuk dropdown login jika diperlukan)
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// 2. Login (DIPERBAIKI: Menggunakan username, bukan nama)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Cari berdasarkan username
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "Username tidak ditemukan" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Password salah" });

  const token = jwt.sign({ id: user._id, role: user.role }, 'RAHASIA_NEGARA', { expiresIn: '1d' });
  res.json({ token, user: { nama: user.nama, username: user.username, role: user.role } });
});

// 3. FITUR BARU: Verifikasi Token & Cek Status Akun (Auto-Kick)
router.get('/verify', async (req, res) => {
  try {
    // Tangkap tiket (token) yang dikirim oleh Frontend
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Tidak ada token" });

    // Baca isi tiketnya
    const decoded = jwt.verify(token, 'RAHASIA_NEGARA');
    
    // Cek ke buku induk (database), apakah orang ini masih ada?
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Akun telah dihapus oleh Admin" });

    res.json({ message: "Token valid dan Akun aktif" });
  } catch (error) {
    res.status(401).json({ message: "Sesi tidak valid atau telah kadaluarsa" });
  }
});

module.exports = router;