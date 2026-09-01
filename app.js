const express = require('express');
const app = express();

app.use(express.json());

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

// Ruta raíz añadida
app.get('/', (req, res) => {
  res.json({ message: "Bienvenido a la API de Numerología funcionando al 100%" });
});

module.exports = app;