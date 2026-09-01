const axios = require('axios');
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no está configurada en las variables de entorno." });
    }

    // Llamada directa a la REST API oficial de Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const googleResponse = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const lecturaTexto = googleResponse.data.candidates[0].content.parts[0].text;

    const nuevaLectura = await Reading.create({
      user_id: req.user.id,
      prompt,
      respuesta: lecturaTexto,
      tipo
    });

    res.status(201).json(nuevaLectura);
  } catch (error) {
    console.error("Error en generateReading:", error.response ? error.response.data : error.message);
    const mensajeError = error.response && error.response.data && error.response.data.error 
      ? error.response.data.error.message 
      : error.message;
    res.status(500).json({ error: mensajeError });
  }
};