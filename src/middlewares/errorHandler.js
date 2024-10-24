// Middleware para manejar errores en la aplicación
export function errorHandler(err, req, res, next) {
    // Registra el error en la consola
    console.error('Error:', err);

    // Si ya se han enviado los headers, pasa el error al siguiente middleware
    if (res.headersSent) {
        return next(err);
    }

    // Valores por defecto para el código de estado y el mensaje
    let statusCode = 500;
    let message = 'Error interno del servidor';

    // Manejo de errores específicos
    if (err.name === 'ValidationError') {
        // Error de validación (por ejemplo, datos de entrada incorrectos)
        statusCode = 400;
        message = 'Error de validación: ' + err.message;
    } else if (err.name === 'UnauthorizedError') {
        // Error de autenticación
        statusCode = 401;
        message = 'No autorizado';
    } else if (err.name === 'ForbiddenError') {
        // Error de autorización
        statusCode = 403;
        message = 'Acceso prohibido';
    } else if (err.name === 'NotFoundError') {
        // Recurso no encontrado
        statusCode = 404;
        message = 'Recurso no encontrado';
    }

    // En desarrollo, incluye el stack trace completo del error
    const error = process.env.NODE_ENV === 'development' ? err : {};

    // Envía la respuesta de error
    res.status(statusCode).json({
        error: true,
        message: message,
        // Incluye el stack trace solo en entorno de desarrollo
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}
