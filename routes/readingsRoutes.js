const express = require('express');
const router = express.Router();
const readingsController = require('../controllers/readingsController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/generate', verifyToken, readingsController.generateReading);

if (readingsController.getHistory) {
  router.get('/history', verifyToken, readingsController.getHistory);
}

module.exports = router;