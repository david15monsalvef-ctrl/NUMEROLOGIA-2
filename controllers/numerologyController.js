const calculate = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { fechaNacimiento } = req.body;

    if (!fechaNacimiento) {
      return res.status(400).json({ error: "La fecha de nacimiento es requerida" });
    }

    // Sumar todos los dígitos
    const digits = fechaNacimiento.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, curr) => acc + parseInt(curr), 0);

    // Reducir a un solo dígito o número maestro (11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    }

    res.json({
      mensaje: "Cálculo numerológico realizado exitosamente",
      usuarioId: userId,
      fechaNacimiento,
      numeroVida: sum
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  calculate
};