const express = require('express');
const router = express.Router();
const readingsController = require('../controllers/readingsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, readingsController.generateReading);
router.get('/history', authMiddleware, readingsController.getHistory);

module.exports = router;