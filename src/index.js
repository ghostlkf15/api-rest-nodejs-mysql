import app from './app.js';
import config from './config.js';

// Establecer el puerto de la aplicación
app.set('port', config.app.port);

const PORT = app.get('port');

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Entorno: ${config.app.nodeEnv}`);
});

// Manejo de errores en el inicio del servidor
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // Manejar errores específicos de inicio del servidor
    switch (error.code) {
        case 'EACCES':
            console.error(`El puerto ${PORT} requiere privilegios elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`El puerto ${PORT} ya está en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando el servidor con gracia...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido. Cerrando el servidor con gracia...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});
