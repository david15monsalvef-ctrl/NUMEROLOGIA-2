const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);