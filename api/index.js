import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from '../routes/authRoutes.js';
import usuarioRoutes from '../routes/usuarioRoutes.js';
import materiaRoutes from '../routes/materiaRoutes.js';
import alumnoRoutes from '../routes/alumnoRoutes.js';
import verificarToken from '../middlewares/verificarToken.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://frontend-tutorias-3f42.vercel.app', // Tu dominio exacto de Vercel
  credentials: true,
};


app.use(cors(corsOptions));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', verificarToken, usuarioRoutes);
app.use('/api/materias', verificarToken, materiaRoutes);
app.use('/api/alumnos', verificarToken, alumnoRoutes);
app.get("/", (req, res) => {
  res.send("API de tutorías funcionando correctamente.");
});


export default app;
