const mongoose = require('mongoose');

// Membuat cetakan (schema) untuk data Produk
const produkSchema = new mongoose.Schema({
  nama_produk: {
    type: String,
    required: true // Artinya data ini wajib diisi
  },
  harga: {
    type: Number,
    required: true
  },
  kategori: {
    type: String,
    default: 'Minuman' // Nilai bawaan jika tidak diisi
  },
  ketersediaan: {
    type: Boolean,
    default: true // true berarti stok ada/tersedia
  }
}, { timestamps: true }); // Otomatis mencatat waktu kapan data dibuat/diupdate

// Mengekspor model agar bisa dipakai di file lain
module.exports = mongoose.model('Produk', produkSchema, 'produk');