const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Memanggil sang "Koki" (Controller)
const produkController = require('../controllers/produkController');

// Memastikan folder 'uploads' tersedia
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
});
const upload = multer({ storage: storage });

// --- DAFTAR RUTE (SANGAT BERSIH) ---

// Ambil data
router.get('/', produkController.getSemuaProduk);

// Tambah data (Multer mencegat 'gambar' dulu, baru dilempar ke Controller)
router.post('/', upload.single('gambar'), produkController.tambahProduk);

// Hapus data
router.delete('/:id', produkController.hapusProduk);

// Update data (Multer mencegat 'gambar' dulu, baru dilempar ke Controller)
router.put('/:id', upload.single('gambar'), produkController.updateProduk);

module.exports = router;