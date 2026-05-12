const Transaksi = require('../models/Transaksi');

// 1. Fungsi untuk mencatat transaksi baru (Checkout)
exports.buatTransaksi = async (req, res) => {
  try {
    // Menangkap data yang dikirim dari Frontend (HP/Web)
    const { nama_kasir, pesanan, total_harga, uang_bayar, kembalian } = req.body;

    // Memasukkan data ke dalam cetakan Transaksi
    const transaksiBaru = new Transaksi({
      nama_kasir,
      pesanan,
      total_harga,
      uang_bayar,
      kembalian
    });

    const simpanTransaksi = await transaksiBaru.save(); // Simpan ke MongoDB
    res.status(201).json(simpanTransaksi); // Kembalikan respon sukses
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Fungsi untuk mengambil semua riwayat penjualan (Untuk laporan/dashboard)
exports.getSemuaTransaksi = async (req, res) => {
  try {
    // Kita gunakan .sort({ createdAt: -1 }) agar transaksi paling baru muncul paling atas
    const riwayat = await Transaksi.find().sort({ createdAt: -1 });
    res.json(riwayat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};