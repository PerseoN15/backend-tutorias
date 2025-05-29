import express from 'express';
import {
  crearAlumno,
  obtenerAlumnos,
  obtenerAlumnoPorId,
  actualizarAlumno,
  eliminarAlumno,
  asignarMaterias,
  registrarCalificaciones,
  eliminarMateriaAsignada,
  eliminarTodasMateriasAlumno
} from '../controllers/alumnoController.js';

import verificarToken from '../middlewares/verificarToken.js'; // ✅ Importar el middleware

const router = express.Router();

// ✅ Crear y obtener alumnos (protegido)
router.post('/', verificarToken, crearAlumno);
router.get('/', verificarToken, obtenerAlumnos);

// ✅ Operaciones por ID (protegido)
router.get('/:id', verificarToken, obtenerAlumnoPorId);
router.put('/:id', verificarToken, actualizarAlumno);
router.delete('/:id', verificarToken, eliminarAlumno);

// ✅ Funcionalidades específicas (protegido)
router.put('/:id/asignar-materias', verificarToken, asignarMaterias);
router.put('/:id/registrar-calificaciones', verificarToken, registrarCalificaciones);
router.put('/:id/eliminar-materia', verificarToken, eliminarMateriaAsignada);
router.put('/:id/eliminar-todas-materias', verificarToken, eliminarTodasMateriasAlumno);

export default router;
