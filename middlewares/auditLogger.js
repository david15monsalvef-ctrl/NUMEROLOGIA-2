const AuditLog = require('../models/AuditLog');

// Primera función o middleware principal
const auditLogger = (req, res, next) => {
  res.on('finish', async () => {
    try {
      await AuditLog.create({
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        userId: req.user ? req.user.id : null
      });
    } catch (err) {
      console.error("Error guardando el audit log:", err);
    }
  });

  next();
};

// Segunda función o middleware alternativo
const auditLoggerCustom = (req, res, next) => {
  // Lógica de la segunda función...
  next();
};

// Exportar ambas funciones dentro de un objeto
module.exports = {
  auditLogger,
  auditLoggerCustom
};