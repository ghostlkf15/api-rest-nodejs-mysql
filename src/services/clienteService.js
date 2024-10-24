import { db } from '../db/mysql.js'; // Asegúrate de que esto coincida con la exportación

export const actualizarCliente = async (id, data) => {
  // Validación básica de los datos
  if (!id || typeof id !== 'number') {
    throw new Error('ID de cliente inválido');
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    throw new Error('Datos de actualización inválidos');
  }

  try {
    // Verificar si el cliente existe antes de actualizar
    const clienteExistente = await db.get('clientes', id);
    if (!clienteExistente) {
      throw new Error('Cliente no encontrado');
    }

    // Realizar la actualización
    const affectedRows = await db.update('clientes', { id, ...data });
    
    if (affectedRows > 0) {
      // Obtener el cliente actualizado
      const clienteActualizado = await db.get('clientes', id);
      return clienteActualizado;
    } else {
      throw new Error('No se pudo actualizar el cliente');
    }
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    throw error;
  }
};

// Función para obtener un cliente por ID
export const obtenerCliente = async (id) => {
  const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0];
};

// Función para listar todos los clientes
export const listarClientes = async () => {
  try {
    const clientes = await db.list('clientes');
    console.log('Clientes obtenidos en el servicio:', clientes);
    return clientes;
  } catch (error) {
    console.error('Error al listar clientes:', error);
    throw error;
  }
};

export const eliminarCliente = async (id) => {
  try {
    const result = await db.remove('clientes', id);
    return result;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};

export const crearCliente = async (clienteData) => {
  try {
    console.log('Datos recibidos en crearCliente:', JSON.stringify(clienteData, null, 2));
    
    const datosParaInsertar = {
      nombre: clienteData.nombre,
      edad: clienteData.edad,
      profesion: clienteData.profesion
    };
    
    // Eliminar propiedades undefined o null
    Object.keys(datosParaInsertar).forEach(key => 
      (datosParaInsertar[key] === undefined || datosParaInsertar[key] === null) && delete datosParaInsertar[key]
    );
    
    console.log('Datos para insertar:', JSON.stringify(datosParaInsertar, null, 2));
    
    const insertedId = await db.insert('clientes', datosParaInsertar);
    console.log('ID del cliente insertado:', insertedId);
    
    if (!insertedId) {
      throw new Error('No se pudo obtener el ID del cliente insertado');
    }
    
    const nuevoCliente = await db.get('clientes', insertedId);
    console.log('Nuevo cliente recuperado:', JSON.stringify(nuevoCliente, null, 2));
    
    return nuevoCliente;
  } catch (error) {
    console.error('Error detallado al crear cliente:', error);
    throw error;
  }
};
