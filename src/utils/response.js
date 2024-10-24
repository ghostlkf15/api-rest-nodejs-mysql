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

export const success = (req, res, data = null, message = '', status = 200) => {
  if (res.headersSent) {
    console.warn('Headers already sent. Unable to send success response.');
    return;
  }

  logResponse('log', req, status, message);

  res.status(status).json({
    error: false,
    status,
    data,
    message
  });
};

export const error = (req, res, message = 'Error interno del servidor', status = 500, errorDetails = null) => {
  if (res.headersSent) {
    console.warn('Headers already sent. Unable to send error response.');
    return;
  }

  logResponse('error', req, status, message);

  const response = {
    error: true,
    status,
    message
  };

  if (process.env.NODE_ENV === 'development' && errorDetails) {
    response.errorDetails = errorDetails;
  }

  res.status(status).json(response);
};
