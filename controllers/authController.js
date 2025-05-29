import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';


export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
      return res.status(400).json({ message: 'Nombre y contraseña obligatorios' });
    }

    const existente = await Usuario.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, contraseña: hash });
    await nuevoUsuario.save();

    console.log("Usuario registrado:", nombre);

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el registro', error: err.message });
  }
};


export const loginUsuario = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
      return res.status(400).json({ message: 'Nombre y contraseña obligatorios' });
    }

    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado' });

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // 🔐 Firmar token JWT
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};
