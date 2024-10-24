import { pool } from '../database.js';  

class Cliente {
  // Método estático para buscar y actualizar un cliente por su ID
  static async findByIdAndUpdate(id, updateData) {
    let connection;
    try {
      // Obtiene una conexión del pool de conexiones
      connection = await pool.getConnection();
      console.log('Conexión obtenida para actualizar cliente');

      console.log('Ejecutando actualización para el cliente con ID:', id);
      console.log('Datos de actualización:', updateData);

      // Ejecuta la consulta de actualización
      const [result] = await connection.query(
        'UPDATE clientes SET ? WHERE id = ?',
        [updateData, id]
      );
      console.log('Resultado de la actualización:', result);

      // Si no se actualizó ningún registro, significa que el cliente no existe
      if (result.affectedRows === 0) {
        console.log('No se encontró el cliente con ID:', id);
        return null;
      }

      console.log('Buscando el cliente actualizado');
      // Obtiene el cliente actualizado de la base de datos
      const [updatedClients] = await connection.query(
        'SELECT * FROM clientes WHERE id = ?',
        [id]
      );
      console.log('Cliente actualizado:', updatedClients[0]);

      // Devuelve el cliente actualizado
      return updatedClients[0];
    } catch (error) {
      // Registra y re-lanza cualquier error que ocurra
      console.error('Error en findByIdAndUpdate:', error);
      throw error; // Re-lanza el error para que pueda ser manejado en la capa de rutas
    } finally {
      // Asegura que la conexión se libere incluso si ocurre un error
      if (connection) {
        console.log('Liberando conexión');
        connection.release();
      }
    }
  }
}

export default Cliente;
