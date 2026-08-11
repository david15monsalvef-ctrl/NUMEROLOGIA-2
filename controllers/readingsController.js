const ai = require('../config/gemini');
const Reading = require('../models/Reading');
const NumerologyProfile = require('../models/NumerologyProfile');

exports.generateReading = async (req, res) => {
  try {
    const { tipo } = req.body;
    const profile = await NumerologyProfile.findOne({ user_id: req.user.id });

    if (!profile) {
      return res.status(400).json({ message: "Debes calcular tu perfil numerológico antes de pedir una lectura." });
    }

    const prompt = `Eres un numerólogo experto. Genera una interpretación ${tipo} para una persona con los siguientes datos:
    - Número de Camino de Vida: ${profile.numero_vida}
    - Número de Expresión: ${profile.numero_expresion}
    - Número de Alma: ${profile.numero_alma}
    
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

exports.getHistory = async (req, res) => {
  try {
    const history = await Reading.find({ user_id: req.user.id }).sort({ fecha: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};