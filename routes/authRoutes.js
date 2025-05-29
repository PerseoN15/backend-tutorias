import express from 'express';
import { loginUsuario, registrarUsuario } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', loginUsuario);
router.post('/register', registrarUsuario);

router.get('/exists/:nombre', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombre: req.params.nombre });
    res.json({ existe: !!usuario });
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar usuario' });
  }
});


export default router;
