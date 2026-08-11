const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Obtener el header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token válido.' });
    }

    // 2. Extraer el token de "Bearer <TOKEN>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no encontrado' });
    }

    // 3. Verificar token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_backup');

    // 4. Inyectar 'user' en 'req' garantizando la propiedad 'id'
    req.user = {
      id: decoded.id || decoded._id
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};