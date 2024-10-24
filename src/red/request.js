const logResponse = (type, req, status) => {
  console[type](
    `[response ${type}]`,
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    `Status: ${status}`
  );
};

export const success = (req, res, data = null, message = '', status = 200) => {
  logResponse('log', req, status);
  res.status(status).json({
    error: false,
    status,
    message,
    data
  });
};

export const error = (req, res, message = 'Internal server error', status = 500, errorDetails = null) => {
  logResponse('error', req, status);
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
