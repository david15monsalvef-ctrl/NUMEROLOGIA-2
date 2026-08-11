const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función de registro
const register = async (req, res) => {
  try {
    const { 
      nombreCompleto, 
      nombre, 
      fecha_nacimiento, 
      fechaNacimiento, 
      email, 
      password,
      password_hash 
    } = req.body;

    const emailVal = email;
    const passVal = password || password_hash;
    const nameVal = nombreCompleto || nombre;
    const dateVal = fecha_nacimiento || fechaNacimiento;

    if (!emailVal || !passVal || !nameVal || !dateVal) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const existingUser = await User.findOne({ email: emailVal });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passVal, salt);

    // Mongoose asigna directamente password_hash
    const newUser = await User.create({
      nombreCompleto: nameVal,
      fecha_nacimiento: dateVal,
      email: emailVal,
      password_hash: hashedPassword
    });

    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET || 'secreto_backup', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      token,
      usuario: {
        id: newUser._id,
        nombreCompleto: newUser.nombreCompleto,
        email: newUser.email,
        fecha_nacimiento: newUser.fecha_nacimiento
      }
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función de login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Por favor ingresa email y contraseña" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secreto_backup', 
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: user._id,
        nombreCompleto: user.nombreCompleto,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login
};