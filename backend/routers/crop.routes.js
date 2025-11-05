// routes/crop.routes.js
const express = require('express');
const router = express.Router();
const cropController  = require('../controllers/crop.controller');

// GET /api/crops -> Lấy toàn bộ cây trồng
router.get('/', cropController.Crop);

module.exports = router;
