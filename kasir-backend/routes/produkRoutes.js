const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

// Jika ada permintaan GET (mengambil data) ke '/', jalankan fungsi getSemuaProduk
router.get('/', produkController.getSemuaProduk);

// Jika ada permintaan POST (mengirim data baru) ke '/', jalankan fungsi tambahProduk
router.post('/', produkController.tambahProduk);

module.exports = router;