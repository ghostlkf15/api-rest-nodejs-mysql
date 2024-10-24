import express from 'express';
import config from './config.js';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import clientesRouter from './routes/clientes.js';
import cors from 'cors';
import { db } from './db/mysql.js';
import { pool } from './database.js';

const app = express();

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware de logging
app.use((req, res, next) => {
  console.log('Solicitud recibida:');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Cuerpo:', JSON.stringify(req.body, null, 2));
  next();
});

// Configuración
app.set('port', config.app.port || 3000);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Rutas API
app.use('/api/clientes', clientesRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Middleware de manejo de errores
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

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

export default app;
