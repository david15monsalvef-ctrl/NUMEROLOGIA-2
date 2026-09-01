const { GoogleGenAI } = require('@google/genai');

// Forzamos al SDK a usar la variable de entorno con el token de GCP
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

module.exports = ai;