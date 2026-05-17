const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Ambil semua user (untuk dropdown login)
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// 2. Registrasi User Baru (Hanya dipakai saat setup/admin)
router.post('/register', async (req, res) => {
  try {
    const { nama, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userBaru = new User({ nama, password: hashedPassword, role });
    await userBaru.save();
    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// 3. Login
router.post('/login', async (req, res) => {
  const { nama, password } = req.body;
  const user = await User.findOne({ nama });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Password salah" });

  const token = jwt.sign({ id: user._id, role: user.role }, 'RAHASIA_NEGARA', { expiresIn: '1d' });
  res.json({ token, user: { nama: user.nama, role: user.role } });
});

module.exports = router;