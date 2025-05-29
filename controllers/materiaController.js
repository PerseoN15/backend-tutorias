import Materia from '../models/Materia.js';

// Crear nueva materia
export const crearMateria = async (req, res) => {
  try {
    const { nombre, carrera, semestre } = req.body;
    const nuevaMateria = new Materia({ nombre, carrera, semestre });
    await nuevaMateria.save();
    res.status(201).json(nuevaMateria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear materia', error: error.message });
  }
};

export const obtenerMaterias = async (req, res) => {
  try {
    const filtro = req.query.carrera ? { carrera: req.query.carrera } : {};
    const materias = await Materia.find(filtro);
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener materias', error: error.message });
  }
};

