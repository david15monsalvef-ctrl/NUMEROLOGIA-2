const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Servir los archivos estáticos de la interfaz desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const auditLogger = require('./middlewares/auditLogger');
const authRoutes = require('./routes/authRoutes');
const numerologyRoutes = require('./routes/numerologyRoutes');
const readingsRoutes = require('./routes/readingsRoutes');
const compatibilityRoutes = require('./routes/compatibilityRoutes');

console.log('auditLogger:', typeof auditLogger);
console.log('authRoutes:', typeof authRoutes);
console.log('numerologyRoutes:', typeof numerologyRoutes);
console.log('readingsRoutes:', typeof readingsRoutes);
console.log('compatibilityRoutes:', typeof compatibilityRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/readings', readingsRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);

// La ruta raíz anterior que devolvía JSON fue eliminada para que Express cargue el index.html automáticamente.
// Si quieres mantener el mensaje de bienvenida de la API en formato JSON, puedes usar otra ruta como /api/status:
app.get('/api/status', (req, res) => {
  res.json({ message: "Bienvenido a la API de Numerología funcionando al 100%" });
});

module.exports = app;