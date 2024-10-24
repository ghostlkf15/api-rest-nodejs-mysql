// Importar el módulo mysql2/promise para manejar conexiones a MySQL de forma asíncrona
import mysql from 'mysql2/promise';

// Importar la configuración de la aplicación
import config from './config.js';

// Crear y exportar un pool de conexiones a la base de datos
export const pool = mysql.createPool({
  // Expandir todas las propiedades de configuración de la base de datos
  ...config.db,
  // Habilitar el uso de marcadores de posición nombrados en las consultas SQL
  namedPlaceholders: true
});
