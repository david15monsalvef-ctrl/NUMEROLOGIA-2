const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { calculate } = require('../controllers/numerologyController');

// Middleware de autenticación integrado
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_backup');
    
    req.user = { id: decoded.id || decoded._id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

router.post('/calculate', verifyToken, calculate);

module.exports = router;