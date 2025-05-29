import express from 'express';
import {
  crearUsuario,
  obtenerUsuarios
} from '../controllers/usuarioController.js';

import verificarToken from '../middlewares/verificarToken.js'; 
const router = express.Router();

router.post('/', verificarToken, crearUsuario);
router.get('/', verificarToken, obtenerUsuarios);

export default router;
