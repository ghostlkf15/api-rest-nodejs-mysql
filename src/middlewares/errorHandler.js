export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (res.headersSent) {
        return next(err);
    }

    let statusCode = 500;
    let message = 'Error interno del servidor';

    // Manejo de errores específicos
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Error de validación: ' + err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'No autorizado';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Acceso prohibido';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Recurso no encontrado';
    }

    // En desarrollo, incluye el stack trace
    const error = process.env.NODE_ENV === 'development' ? err : {};

    res.status(statusCode).json({
        error: true,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}
