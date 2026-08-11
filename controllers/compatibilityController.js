const ai = require('../config/gemini');
const NumerologyProfile = require('../models/NumerologyProfile');
const CompatibilityMatch = require('../models/CompatibilityMatch');

const checkCompatibility = async (req, res) => {
  try {
    const { target_user_id, fechaNacimiento1, fechaNacimiento2 } = req.body;

    let num1, num2;

    // Caso 1: Se buscan los perfiles guardados en MongoDB por ID
    if (target_user_id) {
      const profile1 = await NumerologyProfile.findOne({ user_id: req.user.id });
      const profile2 = await NumerologyProfile.findOne({ user_id: target_user_id });

      if (!profile1 || !profile2) {
        return res.status(404).json({ 
          error: 'Ambos usuarios deben tener sus perfiles numerológicos calculados en la base de datos.' 
        });
      }

      num1 = profile1.numero_vida;
      num2 = profile2.numero_vida;
    } 
    // Caso 2: Se envían las fechas directamente desde Postman
    else if (fechaNacimiento1 && fechaNacimiento2) {
      const getLifeNumber = (fecha) => {
        const digits = fecha.replace(/\D/g, '');
        let sum = digits.split('').reduce((acc, curr) => acc + parseInt(curr), 0);
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
          sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
        }
        return sum;
      };

      num1 = getLifeNumber(fechaNacimiento1);
      num2 = getLifeNumber(fechaNacimiento2);
    } else {
      return res.status(400).json({ 
        error: "Debes enviar 'target_user_id' o ambas fechas ('fechaNacimiento1' y 'fechaNacimiento2')" 
      });
    }

    // Cálculo del puntaje base
    const diff = Math.abs(num1 - num2);
    const puntajeBase = Math.max(10, 100 - (diff * 15));

    // Generar prompt para Gemini
    const prompt = `Analiza la compatibilidad numerológica entre dos personas:
    Persona 1 -> Camino Vida: ${num1}
    Persona 2 -> Camino Vida: ${num2}
    
    Proporciona un análisis breve de sus puntos fuertes de compatibilidad y sus posibles desafíos en la relación.`;

    let interpretacionIA = "Análisis no disponible";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      interpretacionIA = response.text;
    } catch (aiError) {
      console.log("Aviso: Gemini no respondió, se entregará el cálculo numérico.", aiError.message);
      interpretacionIA = "Compatibilidad calculada con éxito basándose en números de vida.";
    }

    // Guardar o responder el resultado
    res.status(200).json({
      mensaje: "Análisis de compatibilidad realizado con éxito",
      puntaje: puntajeBase,
      persona1_numeroVida: num1,
      persona2_numeroVida: num2,
      interpretacion: interpretacionIA
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkCompatibility
};