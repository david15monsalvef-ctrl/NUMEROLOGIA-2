const express = require('express');
const router = express.Router();
const { generateReading, getHistory } = require('../controllers/readingsController');
const verifyToken = require('../middlewares/authMiddleware'); 

router.post('/generate', verifyToken, generateReading);
if (getHistory) {
  router.get('/history', verifyToken, getHistory);
}

module.exports = router;