const express = require('express');
const router = express.Router();
const plantDiseaseController = require('../controllers/plantDisease.controller');
const multer = require('multer');

// Cấu hình multer: lưu file tạm trong RAM
const upload = multer({ storage: multer.memoryStorage() });

// Route GET: xem tất cả bệnh
router.get('/', plantDiseaseController.predictPlantDisease);

// Route POST: nhận ảnh và dự đoán
router.post('/predict', upload.single('data'), plantDiseaseController.predictPlantDisease);

module.exports = router;
