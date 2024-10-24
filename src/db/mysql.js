import mysql from 'mysql2/promise';
import config from '../config.js';

// Variable para almacenar el pool de conexiones
let pool;

// Función para inicializar la conexión a la base de datos
const init = async () => {
  try {
    pool = await mysql.createPool({
      ...config.db,
      namedPlaceholders: true  // Habilita el uso de marcadores de posición nombrados
    });
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para ejecutar consultas SQL
const query = async (sql, params) => {
  if (!pool) await init();  // Inicializa la conexión si aún no existe
  console.log('SQL Query:', sql);
  console.log('SQL Params:', JSON.stringify(params, null, 2));
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
};

// Función para listar todos los registros de una tabla
const list = async (table) => {
  try {
    const sql = `SELECT * FROM ${table}`;
    console.log('SQL Query for list:', sql);
    const results = await query(sql);
    console.log('Results from list query:', results);
    return results;
  } catch (error) {
    console.error(`Error al listar registros de la tabla ${table}:`, error);
    throw error;
  }
};

// Función para obtener un registro específico por ID
const get = async (table, id) => {
  const results = await query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  return results[0];
};

// Función para insertar un nuevo registro en una tabla
const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  console.log('Insert SQL:', sql);
  console.log('Insert Values:', JSON.stringify(values, null, 2));
  
  try {
    const result = await query(sql, values);
    console.log('Resultado de la inserción:', JSON.stringify(result, null, 2));
    return result.insertId;
  } catch (error) {
    console.error(`Error al insertar en la tabla ${table}:`, error);
    throw error;
  }
};

// Función para actualizar un registro existente
const update = async (table, data) => {
  const { id, ...updateData } = data;
  const result = await query(`UPDATE ${table} SET ? WHERE id = ?`, [updateData, id]);
  return result.affectedRows;
};

// Función para eliminar un registro por ID
const remove = async (table, id) => {
  const result = await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  return result.affectedRows;
};

// Exporta un objeto con todas las funciones de base de datos
export const db = {
  init,
  query,
  list,
  get,
  insert,
  update,
  remove
};
