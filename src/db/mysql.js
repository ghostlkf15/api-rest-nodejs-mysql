import mysql from 'mysql2/promise';
import config from '../config.js';

let pool;

const init = async () => {
  try {
    pool = await mysql.createPool({
      ...config.db,
      namedPlaceholders: true
    });
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

const query = async (sql, params) => {
  if (!pool) await init();
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

const get = async (table, id) => {
  const results = await query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  return results[0];
};

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

const update = async (table, data) => {
  const { id, ...updateData } = data;
  const result = await query(`UPDATE ${table} SET ? WHERE id = ?`, [updateData, id]);
  return result.affectedRows;
};

const remove = async (table, id) => {
  const result = await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  return result.affectedRows;
};

export const db = {
  init,
  query,
  list,
  get,
  insert,
  update,
  remove
};
