const Produk = require('../models/Produk');
const path = require('path');
const fs = require('fs');

// 1. GET: Ambil Semua Produk
exports.getSemuaProduk = async (req, res) => {
  try {
    const produk = await Produk.find();
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. POST: Tambah Produk Baru
exports.tambahProduk = async (req, res) => {
  try {
    const { nama_produk, harga, kategori, ketersediaan } = req.body;
    
    const produkBaru = new Produk({
      nama_produk,
      harga,
      kategori,
      // Pastikan string 'true' / 'false' dari FormData diubah menjadi boolean
      ketersediaan: ketersediaan === 'true' || ketersediaan === true, 
      gambar: req.file ? req.file.filename : null // req.file sudah disiapkan oleh Multer dari Routes
    });
    
    const simpanProduk = await produkBaru.save();
    res.status(201).json(simpanProduk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. DELETE: Hapus Produk beserta file gambarnya
exports.hapusProduk = async (req, res) => {
  try {
    const produkLama = await Produk.findById(req.params.id);
    
    if (produkLama && produkLama.gambar) {
      // Menggunakan '../uploads' karena file ini ada di dalam folder 'controllers'
      const pathGambar = path.join(__dirname, '../uploads', produkLama.gambar);
      if (fs.existsSync(pathGambar)) {
        fs.unlinkSync(pathGambar); 
      }
    }

    await Produk.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk dan gambar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. PUT: Update Produk beserta ganti gambar
exports.updateProduk = async (req, res) => {
  try {
    const { nama_produk, harga, kategori, ketersediaan } = req.body;
    
    let updateData = { 
      nama_produk, 
      harga, 
      kategori, 
      ketersediaan: ketersediaan === 'true' || ketersediaan === true
    };
    
    if (req.file) {
      updateData.gambar = req.file.filename;

      const produkLama = await Produk.findById(req.params.id);
      
      if (produkLama && produkLama.gambar) {
        const pathGambarLama = path.join(__dirname, '../uploads', produkLama.gambar);
        if (fs.existsSync(pathGambarLama)) {
          fs.unlinkSync(pathGambarLama);
        }
      }
    }

    const updatedProduk = await Produk.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.json(updatedProduk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};