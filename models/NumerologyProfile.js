const mongoose = require('mongoose');

const numerologyProfileSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  numero_vida: { type: Number, required: true },
  numero_expresion: { type: Number, required: true },
  numero_alma: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('NumerologyProfile', numerologyProfileSchema);