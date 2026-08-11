const mongoose = require('mongoose');

const compatibilityMatchSchema = new mongoose.Schema({
  user1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puntaje: { type: Number, required: true },
  interpretacion: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompatibilityMatch', compatibilityMatchSchema);