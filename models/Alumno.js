import mongoose from 'mongoose';

const alumnoSchema = new mongoose.Schema({
  numControl: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  carrera: { type: String, required: true },
  semestre: { type: Number, required: true },
  materiasAsignadas: [
    {
      materiaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
      },
      calificacion: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  ],
  status: {
    type: String,
    default: 'Regular'
  }
});

export default mongoose.model('Alumno', alumnoSchema);
