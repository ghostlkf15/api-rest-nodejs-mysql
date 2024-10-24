import { pool } from '../database.js';  // Asegúrate de que esta ruta sea correcta

class Cliente {
  static async findByIdAndUpdate(id, updateData) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('Conexión obtenida para actualizar cliente');

      console.log('Ejecutando actualización para el cliente con ID:', id);
      console.log('Datos de actualización:', updateData);

      const [result] = await connection.query(
        'UPDATE clientes SET ? WHERE id = ?',
        [updateData, id]
      );
      console.log('Resultado de la actualización:', result);

      if (result.affectedRows === 0) {
        console.log('No se encontró el cliente con ID:', id);
        return null;
      }

      console.log('Buscando el cliente actualizado');
      const [updatedClients] = await connection.query(
        'SELECT * FROM clientes WHERE id = ?',
        [id]
      );
      console.log('Cliente actualizado:', updatedClients[0]);

      return updatedClients[0];
    } catch (error) {
      console.error('Error en findByIdAndUpdate:', error);
      throw error; // Re-lanza el error para que pueda ser manejado en la capa de rutas
    } finally {
      if (connection) {
        console.log('Liberando conexión');
        connection.release();
      }
    }
  }

  // Aquí puedes agregar más métodos según sea necesario
}

export default Cliente;
