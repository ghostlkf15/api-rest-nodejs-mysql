import express from 'express';
import { success, error } from '../utils/response.js';
import { db } from '../db/mysql.js'; 
import { actualizarCliente, obtenerCliente, listarClientes, eliminarCliente, crearCliente } from '../services/clienteService.js';
import Cliente from '../models/Cliente.js';  
import fetch from 'node-fetch';
import { validateClienteData } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Middleware para manejar errores asíncronos
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Ruta para obtener todos los clientes
router.get('/', asyncHandler(async (req, res) => {
  console.log('GET - Obteniendo todos los clientes');
  try {
    const clientes = await listarClientes();
    console.log('Número de clientes obtenidos:', clientes.length);
    success(req, res, clientes, 'Clientes obtenidos con éxito', 200);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    error(req, res, 'Error al obtener clientes', 500);
  }
}));

// Ruta para obtener un cliente por ID
router.get('/:id', asyncHandler(async (req, res) => {
  const clienteId = parseInt(req.params.id);
  console.log('GET - Obteniendo cliente con ID:', clienteId);
  const cliente = await obtenerCliente(clienteId);
  if (!cliente) {
    console.log('Cliente no encontrado');
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }
  console.log('Cliente obtenido:', cliente);
  res.json(cliente);  // Usa res.json() directamente
}));

// Ruta para actualizar un cliente
router.put('/:id', async (req, res, next) => {
  console.log('Headers recibidos:', JSON.stringify(req.headers, null, 2));
  console.log('Cuerpo de la solicitud recibido:', JSON.stringify(req.body, null, 2));
  console.log('Parámetros de la URL:', req.params);
  console.log('Método de la solicitud:', req.method);

  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Ruta PUT - ID del cliente a actualizar:', id);
    console.log('Ruta PUT - Datos de actualización:', JSON.stringify(updateData, null, 2));

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        mensaje: 'El cuerpo de la solicitud está vacío o no es válido. Asegúrate de enviar datos para actualizar y establecer el header Content-Type a application/json.',
        headersRecibidos: req.headers,
        cuerpoRecibido: req.body
      });
    }

    const clienteActualizado = await Cliente.findByIdAndUpdate(id, updateData);

    console.log('Ruta PUT - Resultado de la actualización:', clienteActualizado);

    if (!clienteActualizado) {
      console.log('Ruta PUT - Cliente no encontrado');
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json(clienteActualizado);
  } catch (error) {
    console.error('Error detallado al actualizar cliente:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar cliente', 
      error: error.message, 
      stack: error.stack 
    });
  }
});

router.get('/test-update', async (req, res) => {
  const url = 'http://localhost:3000/api/clientes/1';
  const data = {
    nombre: 'Nuevo Nombre'
  };

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
    .then(data => console.log('Respuesta:', data))
    .catch(error => console.error('Error:', error));
});

// Ruta para crear un nuevo cliente
router.post('/', asyncHandler(async (req, res) => {
  console.log('POST - Creando nuevo cliente');
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const { nombre, edad, profesion } = req.body;
  
  if (typeof nombre !== 'string' || nombre.trim() === '' ||
      typeof edad !== 'number' || isNaN(edad) ||
      typeof profesion !== 'string' || profesion.trim() === '') {
    return error(req, res, 'Datos de cliente inválidos o incompletos', 400);
  }
  
  try {
    const nuevoCliente = await crearCliente({
      nombre: nombre.trim(),
      edad: edad,
      profesion: profesion.trim()
    });
    console.log('Cliente creado:', JSON.stringify(nuevoCliente, null, 2));
    success(req, res, nuevoCliente, 'Cliente creado con éxito', 201);
  } catch (err) {
    console.error('Error detallado al crear cliente en la ruta:', err);
    error(req, res, `Error al crear cliente: ${err.message}`, 500);
  }
}));

// Ruta para eliminar un cliente por ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const clienteId = parseInt(req.params.id);
  console.log('DELETE - Eliminando cliente con ID:', clienteId);
  
  try {
    const resultado = await eliminarCliente(clienteId);
    
    if (resultado === 0) {
      console.log('Cliente no encontrado');
      return error(req, res, 'Cliente no encontrado', 404);
    }
    
    console.log('Cliente eliminado con éxito');
    success(req, res, { mensaje: 'Cliente eliminado con éxito' }, 'Cliente eliminado', 200);
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    error(req, res, 'Error al eliminar cliente', 500);
  }
}));

export default router;
