// Función para registrar las respuestas en la consola
const logResponse = (type, req, status) => {
  console[type](
    `[response ${type}]`,
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    `Status: ${status}`
  );
};

// Función para enviar respuestas exitosas
export const success = (req, res, data = null, message = '', status = 200) => {
  // Registra la respuesta exitosa
  logResponse('log', req, status);
  // Envía la respuesta JSON
  res.status(status).json({
    error: false,
    status,
    message,
    data
  });
};

// Función para enviar respuestas de error
export const error = (req, res, message = 'Internal server error', status = 500, errorDetails = null) => {
  // Registra la respuesta de error
  logResponse('error', req, status);
  // Prepara el objeto de respuesta
  const response = {
    error: true,
    status,
    message
  };

  // Si estamos en modo desarrollo y se proporcionaron detalles del error, inclúyelos en la respuesta
  if (process.env.NODE_ENV === 'development' && errorDetails) {
    response.errorDetails = errorDetails;
  }

  // Envía la respuesta JSON de error
  res.status(status).json(response);
};
