// db/conexion.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class ConexionMongoDB {
  constructor() {
    if (ConexionMongoDB.instancia) {
      return ConexionMongoDB.instancia; // Singleton: reutiliza la instancia
    }

    this.estado = 'desconectado';
    ConexionMongoDB.instancia = this;
  }

  async conectar() {
    if (this.estado === 'conectado') {
      console.log('Ya existe una conexión activa con MongoDB');
      return mongoose.connection;
    }

    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.estado = 'conectado';

      mongoose.connection.on('connected', () => {
        console.log('MongoDB conectado con éxito');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Error en MongoDB:', err);
      });

      mongoose.connection.on('disconnected', () => {
        this.estado = 'desconectado';
        console.warn('Conexión a MongoDB perdida');
      });

      return mongoose.connection;

    } catch (error) {
      console.error('Fallo en la conexión inicial a MongoDB:', error.message);
      throw error;
    }
  }

  getEstado() {
    return this.estado;
  }
}

// Exportar siempre la misma instancia
const conexionMongo = new ConexionMongoDB();
export default conexionMongo;
