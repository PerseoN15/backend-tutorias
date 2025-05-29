import Alumno from '../models/Alumno.js';
import Materia from '../models/Materia.js';

// ✅ Alta (crear alumno con validación de materias)
export const crearAlumno = async (req, res) => {
  try {
    const { numControl, nombre, edad, carrera, semestre, materiasAsignadas = [] } = req.body;

    // Validar duplicado
    const existente = await Alumno.findOne({ numControl });
    if (existente) {
      return res.status(400).json({ message: 'El número de control ya existe' });
    }

    // Validar materias si vienen
    if (materiasAsignadas.length > 0) {
      const materias = await Materia.find({
        _id: { $in: materiasAsignadas.map(m => m.materiaId) }
      });

      const materiasInvalidas = materias.filter(m => m.carrera !== carrera);
      if (materiasInvalidas.length > 0) {
        return res.status(400).json({ 
          message: 'Las materias asignadas no coinciden con la carrera del alumno',
          materiasInvalidas
        });
      }
    }

    const nuevoAlumno = new Alumno({
      numControl,
      nombre,
      edad,
      carrera,
      semestre,
      materiasAsignadas
    });

    await nuevoAlumno.save();
    res.status(201).json(nuevoAlumno);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear alumno', error: err.message });
  }
};


// ✅ Consulta general
export const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find().populate('materiasAsignadas.materiaId');
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener alumnos' });
  }
};

// ✅ Consulta específica
export const obtenerAlumnoPorId = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id).populate('materiasAsignadas.materiaId');
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error: error.message });
  }
};

// ✅ Cambios (actualizar alumno)
export const actualizarAlumno = async (req, res) => {
  try {
    const actualizado = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Alumno no encontrado' });
    res.json({ message: 'Alumno actualizado', alumno: actualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar alumno', error: error.message });
  }
};

// ✅ Baja (eliminar alumno)
export const eliminarAlumno = async (req, res) => {
  try {
    const eliminado = await Alumno.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Alumno no encontrado' });
    res.json({ message: 'Alumno eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar alumno', error: error.message });
  }
};

// ✅ Asignar materias a un alumno
export const asignarMaterias = async (req, res) => {
  try {
    const { materias } = req.body;

    if (!Array.isArray(materias) || materias.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron materias válidas' });
    }

    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });

    // Validar que las materias coincidan con la carrera del alumno
    const materiasBD = await Materia.find({ _id: { $in: materias.map(m => m.materiaId) } });
    const materiasInvalidas = materiasBD.filter(m => m.carrera !== alumno.carrera);

    if (materiasInvalidas.length > 0) {
      return res.status(400).json({
        message: 'Las materias asignadas no coinciden con la carrera del alumno',
        materiasInvalidas
      });
    }

    alumno.materiasAsignadas = materias.map(m => ({
      materiaId: m.materiaId,
      calificacion: m.calificacion ?? 0
    }));

    await alumno.save();

    res.json({ message: 'Materias asignadas correctamente', alumno });
  } catch (error) {
    res.status(500).json({
      message: 'Error al asignar materias al alumno',
      error: error.message
    });
  }
};

// ✅ Registrar calificaciones y evaluar estatus
export const registrarCalificaciones = async (req, res) => {
  try {
    const { calificaciones } = req.body;

    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });

    let contadorIrregular = 0;

    alumno.materiasAsignadas = alumno.materiasAsignadas.map((materia) => {
      const nueva = calificaciones.find(c => c.materiaId === materia.materiaId.toString());
      if (nueva) {
        materia.calificacion = nueva.calificacion;
        if (nueva.calificacion < 70) contadorIrregular++;
      }
      return materia;
    });

    alumno.status = contadorIrregular >= 2 ? 'Irregular' : 'Regular';

    await alumno.save();
    res.json({ message: 'Calificaciones registradas', alumno });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar calificaciones', error: error.message });
  }
};

export const eliminarMateriaAsignada = async (req, res) => {
  try {
    const { materiaId } = req.body;
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });

    alumno.materiasAsignadas = alumno.materiasAsignadas.filter(m =>
      m.materiaId.toString() !== materiaId
    );

    // Recalcular estatus después de eliminar
    const materiasIrregulares = alumno.materiasAsignadas.filter(m => m.calificacion < 70).length;
    alumno.status = materiasIrregulares >= 2 ? 'Irregular' : 'Regular';

    await alumno.save();
const alumnoActualizado = await Alumno.findById(alumno._id).populate('materiasAsignadas.materiaId');
res.json({ message: 'Materia eliminada', alumno: alumnoActualizado });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar materia', error: error.message });
  }
};

export const eliminarTodasMateriasAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await Alumno.findById(id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });

    alumno.materiasAsignadas = [];
    alumno.status = 'Regular';
    await alumno.save();

    res.json({ message: 'Todas las materias eliminadas', alumno });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar todas las materias' });
  }
};




