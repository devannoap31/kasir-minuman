const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// URL untuk melihat laporan penjualan (Metode: GET)
router.get('/', transaksiController.getSemuaTransaksi);

// URL untuk mengirim data transaksi baru (Metode: POST)
router.post('/', transaksiController.buatTransaksi);

module.exports = router;