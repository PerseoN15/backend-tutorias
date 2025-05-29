// 1. Configuraciones y dependencias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import materiaRoutes from './routes/materiaRoutes.js';
import alumnoRoutes from './routes/alumnoRoutes.js';
import verificarToken from './middlewares/verificarToken.js';

dotenv.config();
const app = express();

// 2. ✅ Middleware de CORS ANTES de las rutas
app.use(cors({
  origin: [
    'https://frontend-tutorias.vercel.app',
    'https://frontend-tutorias-3f42.vercel.app'
  ],
  credentials: true
}));

// 3. Otras configuraciones
app.use(express.json());

// 4. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// 5. Rutas (deben ir después de `cors`)
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', verificarToken, usuarioRoutes);
app.use('/api/materias', verificarToken, materiaRoutes);
app.use('/api/alumnos', verificarToken, alumnoRoutes);

// 6. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
