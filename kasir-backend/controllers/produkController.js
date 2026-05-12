// Memanggil cetakan data Produk yang sudah kita buat sebelumnya
const Produk = require('../models/Produk');

// 1. Fungsi untuk melihat semua produk
exports.getSemuaProduk = async (req, res) => {
  try {
    const produk = await Produk.find(); // Mencari semua data di koleksi Produk
    res.json(produk); // Mengirimkan datanya dalam bentuk JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Fungsi untuk menambah produk baru ke database
exports.tambahProduk = async (req, res) => {
  const produkBaru = new Produk({
    nama_produk: req.body.nama_produk,
    harga: req.body.harga,
    kategori: req.body.kategori
  });

  try {
    const simpanProduk = await produkBaru.save(); // Menyimpan ke MongoDB
    res.status(201).json(simpanProduk); // Status 201 artinya "Created" (Berhasil dibuat)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};