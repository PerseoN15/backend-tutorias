import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import materiaRoutes from './routes/materiaRoutes.js';
import alumnoRoutes from './routes/alumnoRoutes.js';
import verificarToken from './middlewares/verificarToken.js';

dotenv.config();
const app = express();

// ✅ Middleware CORS manual
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-tutorias-3f42.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Responder sin bloquear
  }
  
  next();
});

app.use(express.json());

// 🔌 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/usuarios', verificarToken, usuarioRoutes);
app.use('/api/materias', verificarToken, materiaRoutes);
app.use('/api/alumnos', verificarToken, alumnoRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Servidor en puerto ${PORT}`));
