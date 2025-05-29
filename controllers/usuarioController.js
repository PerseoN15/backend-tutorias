import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs'; 

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;

    // Verifica si ya existe el nombre
    const existe = await Usuario.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaCifrada = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({ nombre, contraseña: contraseñaCifrada });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contraseña'); // 👈 oculta la contraseña
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};
