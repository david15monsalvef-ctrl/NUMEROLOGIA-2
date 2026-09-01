const ai = require('../config/gemini');
const Reading = require('../models/Reading');
const NumerologyProfile = require('../models/NumerologyProfile');

exports.generateReading = async (req, res) => {
  try {
    const { tipo } = req.body;

    const profile = await NumerologyProfile.findOne({
      $or: [
        { user_id: req.user.id },
        { userId: req.user.id },
        { usuarioId: req.user.id }
      ]
    });

    if (!profile) {
      return res.status(400).json({ message: "Debes calcular tu perfil numerológico antes de pedir una lectura." });
    }

    const numeroVida = profile.numero_vida || profile.numeroVida;
    const numeroExpresion = profile.numero_expresion || profile.numeroExpresion;
    const numeroAlma = profile.numero_alma || profile.numeroAlma;

    const prompt = `Eres un numerólogo experto. Genera una interpretación ${tipo} para una persona con los siguientes datos:
    - Número de Camino de Vida: ${numeroVida}
    - Número de Expresión: ${numeroExpresion}
    - Número de Alma: ${numeroAlma}
    
    Ofrece consejos prácticos y una guía clara sobre sus fortalezas y metas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const lecturaTexto = response.text;

    const nuevaLectura = await Reading.create({
      user_id: req.user.id,
      prompt,
      respuesta: lecturaTexto,
      tipo
    });

    res.status(201).json(nuevaLectura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agrega esta función si en tus rutas tienes un GET
exports.getHistory = async (req, res) => {
  try {
    const history = await Reading.find({
      $or: [{ user_id: req.user.id }, { userId: req.user.id }, { usuarioId: req.user.id }]
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};