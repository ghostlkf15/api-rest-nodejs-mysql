import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: join(__dirname, '..', '.env') });

const config = {
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_test',
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
        queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0
    },
};

// Validación básica de la configuración
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.warn(`Advertencia: Las siguientes variables de entorno no están definidas: ${missingEnvVars.join(', ')}`);
}

export default config;
