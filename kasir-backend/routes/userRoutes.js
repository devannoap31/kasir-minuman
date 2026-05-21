const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Daftar Rute User
router.get('/', userController.getSemuaUser);
router.post('/', userController.tambahUser);
router.delete('/:id', userController.hapusUser);
router.put('/ubah-password', userController.ubahPassword);
router.put('/update-profil', userController.updateProfil);

module.exports = router;