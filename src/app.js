import express from 'express';
import config from './config.js';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import clientesRouter from './routes/clientes.js';
import cors from 'cors';
import { db } from './db/mysql.js';
import { pool } from './database.js';

const app = express();

// Manejo de la solicitud de favicon para evitar errores 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middlewares
app.use(morgan('dev'));  // Logging de solicitudes HTTP
app.use(express.json());  // Parseo de JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));  // Parseo de datos de formularios
app.use(cors());  // Habilita CORS para todas las rutas

// Middleware de logging personalizado
app.use((req, res, next) => {
  console.log('Solicitud recibida:');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Cuerpo:', JSON.stringify(req.body, null, 2));
  next();
});

// Configuración del puerto de la aplicación
app.set('port', config.app.port || 3000);

// Ruta de verificación de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Rutas API para clientes
app.use('/api/clientes', clientesRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Middleware de manejo de errores personalizado
app.use(errorHandler);

// Inicialización de la base de datos
db.init().catch(error => {
  console.error('Error al inicializar la base de datos:', error);
  process.exit(1);
});

// Prueba de conexión a la base de datos
pool.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Middleware para establecer el tipo de contenido de las respuestas
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

export default app;
