const express = require('express');
const router = express.Router();
const agriController  = require('../controllers/agriculture.controller');

router.get('/', agriController.Agriculture);

router.get('/:id', agriController.getAgricultureById);

module.exports = router;
