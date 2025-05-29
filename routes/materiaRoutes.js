import express from 'express';
import { crearMateria, obtenerMaterias } from '../controllers/materiaController.js';
import verificarToken from '../middlewares/verificarToken.js'; 

const router = express.Router();


router.post('/', verificarToken, crearMateria);
router.get('/', verificarToken, obtenerMaterias);

export default router;
