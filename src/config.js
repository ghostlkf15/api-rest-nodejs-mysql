import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: join(__dirname, '..', '.env') });

// Objeto de configuración
const config = {
    app: {
        port: process.env.PORT || 3000,  // Puerto de la aplicación
        nodeEnv: process.env.NODE_ENV || 'development',  // Entorno de ejecución
    },
    db: {
        host: process.env.DB_HOST || 'localhost',  // Host de la base de datos
        user: process.env.DB_USER || 'root',  // Usuario de la base de datos
        password: process.env.DB_PASSWORD || '',  // Contraseña de la base de datos
        database: process.env.DB_NAME || 'db_test',  // Nombre de la base de datos
        waitForConnections: true,  // Esperar por conexiones si no hay disponibles
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,  // Límite de conexiones
        queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0  // Límite de cola (0 significa sin límite)
    },
};

// Validación básica de la configuración
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// Advertir si faltan variables de entorno requeridas
if (missingEnvVars.length > 0) {
    console.warn(`Advertencia: Las siguientes variables de entorno no están definidas: ${missingEnvVars.join(', ')}`);
}

export default config;
