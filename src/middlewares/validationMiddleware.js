// Middleware para validar los datos de un cliente
export const validateClienteData = (req, res, next) => {
  // Extrae los campos relevantes del cuerpo de la solicitud
  const { nombre, edad, profesion } = req.body;

  // Verifica que todos los campos requeridos estén presentes
  if (!nombre || !edad || !profesion) {
    // Si falta algún campo, devuelve un error 400 (Bad Request)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Valida que la edad sea un número positivo
  if (typeof edad !== 'number' || edad < 0) {
    // Si la edad no es válida, devuelve un error 400 (Bad Request)
    return res.status(400).json({ error: 'La edad debe ser un número positivo' });
  }

  // Si todas las validaciones pasan, continúa con el siguiente middleware o ruta
  next();
};
