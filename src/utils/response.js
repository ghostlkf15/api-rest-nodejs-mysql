// Función para registrar las respuestas en la consola
const logResponse = (type, req, status, message) => {
  console[type](
    `[${type.toUpperCase()}]`,
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    `Status: ${status}`,
    `Message: ${message}`
  );
};

// Función para enviar respuestas exitosas
export const success = (req, res, data = null, message = '', status = 200) => {
  // Verifica si los headers ya han sido enviados
  if (res.headersSent) {
    console.warn('Headers already sent. Unable to send success response.');
    return;
  }

  // Registra la respuesta exitosa
  logResponse('log', req, status, message);

  // Envía la respuesta JSON
  res.status(status).json({
    error: false,
    status,
    data,
    message
  });
};

// Función para enviar respuestas de error
export const error = (req, res, message = 'Error interno del servidor', status = 500, errorDetails = null) => {
  // Verifica si los headers ya han sido enviados
  if (res.headersSent) {
    console.warn('Headers already sent. Unable to send error response.');
    return;
  }

  // Registra la respuesta de error
  logResponse('error', req, status, message);

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
