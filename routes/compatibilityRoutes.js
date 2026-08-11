const express = require('express');
const router = express.Router();
const { checkCompatibility } = require('../controllers/compatibilityController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint para calcular la compatibilidad entre dos usuarios
router.post('/check', authMiddleware, checkCompatibility);

module.exports = router;