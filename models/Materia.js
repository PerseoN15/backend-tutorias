import mongoose from 'mongoose';

const materiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  carrera: {
    type: String,
    required: true
  },
  semestre: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  }
}, {
  timestamps: true
});

export default mongoose.model('Materia', materiaSchema);
