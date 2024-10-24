export const validateClienteData = (req, res, next) => {
  const { nombre, edad, profesion } = req.body;
  if (!nombre || !edad || !profesion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if (typeof edad !== 'number' || edad < 0) {
    return res.status(400).json({ error: 'La edad debe ser un número positivo' });
  }
  next();
};
