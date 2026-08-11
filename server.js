require('dotenv').config({ path: './utils/.env' });
const app = require('./app');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});