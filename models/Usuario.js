import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,        
    trim: true
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6         
  }
}, {
  timestamps: true        
});

export default mongoose.model('Usuario', usuarioSchema);
