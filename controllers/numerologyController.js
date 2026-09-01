const NumerologyProfile = require('../models/NumerologyProfile');
const { calcularCaminoDeVida, calcularExpresion, calcularAlma } = require('../utils/numerologyCalculators');

const calculate = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { nombreCompleto, fechaNacimiento } = req.body;

    if (!fechaNacimiento || !nombreCompleto) {
      return res.status(400).json({ error: "El nombre completo y la fecha de nacimiento son requeridos" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // 1. Calcular los números numerológicos
    const numeroVida = calcularCaminoDeVida(fechaNacimiento);
    const numeroExpresion = calcularExpresion(nombreCompleto);
    const numeroAlma = calcularAlma(nombreCompleto);

    // 2. Guardar o actualizar el perfil en MongoDB
    const perfil = await NumerologyProfile.findOneAndUpdate(
      { user_id: userId },
      { 
        user_id: userId,
        numero_vida: numeroVida,
        numero_expresion: numeroExpresion,
        numero_alma: numeroAlma
      },
      { new: true, upsert: true }
    );

    // 3. Responder al cliente
    res.json({
      mensaje: "Cálculo numerológico realizado y guardado exitosamente",
      perfil
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  calculate
};