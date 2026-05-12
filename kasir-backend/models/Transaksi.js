const mongoose = require('mongoose');

const transaksiSchema = new mongoose.Schema({
  nama_kasir: {
    type: String,
    required: true,
    default: 'Kasir Utama' // Bisa diubah nanti sesuai siapa yang jaga gerobak
  },
  pesanan: [
    {
      nama_produk: { type: String, required: true },
      harga: { type: Number, required: true },
      jumlah: { type: Number, required: true },
      subtotal: { type: Number, required: true }
    }
  ],
  total_harga: {
    type: Number,
    required: true
  },
  uang_bayar: {
    type: Number,
    required: true
  },
  kembalian: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // Otomatis mencatat tanggal dan jam transaksi

module.exports = mongoose.model('Transaksi', transaksiSchema, 'transaksi');