import express from 'express';
import { loginUsuario, registrarUsuario } from '../controllers/authController.js';
import Usuario from '../models/Usuario.js';


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


router.get('/exists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id); // Asegúrate de importar el modelo
    res.json({ exists: !!usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar usuario', error });
  }
});


export default router;
