const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ADVERTENCIA: GEMINI_API_KEY no está configurada.");
}

// Inicialización directa especificando el apiKey explícitamente
const ai = new GoogleGenAI({ apiKey });

module.exports = ai;