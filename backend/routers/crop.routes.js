// routes/crop.routes.js
const express = require('express');
const router = express.Router();
const cropController  = require('../controllers/crop.controller');

// GET /api/crops -> Lấy toàn bộ cây trồng
router.get('/', cropController.Crop);

// Thêm cây trồng mới
router.post('/', cropController.addCrop);

router.put('/:id', cropController.updateCrop);

router.delete('/:id', cropController.deleteCrop);

module.exports = router;
