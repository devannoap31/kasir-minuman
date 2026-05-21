const User = require('../models/User');
const bcrypt = require('bcrypt'); // Kita gunakan bcrypt untuk mengacak password agar aman

// 1. Ambil semua data user (tanpa mengirimkan passwordnya ke frontend)
exports.getSemuaUser = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Tambah user baru (Otomatis jadi Admin)
exports.tambahUser = async (req, res) => {
  try {
    // Kita hapus 'role' dari req.body karena tidak perlu lagi menerima input role
    const { nama, username, password } = req.body;

    // Cek apakah username sudah dipakai
    const userAda = await User.findOne({ username });
    if (userAda) return res.status(400).json({ message: 'Username sudah terdaftar!' });

    // Acak password sebelum disimpan (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    const userBaru = new User({
      nama,
      username,
      password: hashedPassword,
      role: 'Admin' // <--- Paksa role selalu menjadi Admin
    });

    await userBaru.save();
    res.status(201).json({ message: 'User berhasil ditambahkan!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Hapus User
exports.hapusUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Ubah Password Profil Sendiri
exports.ubahPassword = async (req, res) => {
  try {
    const { username, passwordLama, passwordBaru } = req.body;
    
    // Cari user yang sedang login di database
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek apakah password lama yang dimasukkan sesuai
    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah!' });

    // Enkripsi password baru dan simpan
    user.password = await bcrypt.hash(passwordBaru, 10);
    await user.save();

    res.json({ message: 'Password berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Update Data Profil (Nama & Username)
exports.updateProfil = async (req, res) => {
  try {
    const { usernameLama, namaBaru, usernameBaru } = req.body;

    // Jika user mengganti username, pastikan username baru belum dipakai orang lain
    if (usernameLama !== usernameBaru) {
      const cekUsername = await User.findOne({ username: usernameBaru });
      if (cekUsername) return res.status(400).json({ message: 'Username sudah digunakan akun lain!' });
    }

    // Cari user berdasarkan username lama dan update datanya
    const user = await User.findOneAndUpdate(
      { username: usernameLama },
      { nama: namaBaru, username: usernameBaru },
      { new: true } // Kembalikan data yang sudah di-update
    );

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Kirim kembali data terbaru untuk disimpan di Local Storage Frontend
    res.json({ 
      message: 'Profil berhasil diperbarui!', 
      user: { nama: user.nama, username: user.username, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};