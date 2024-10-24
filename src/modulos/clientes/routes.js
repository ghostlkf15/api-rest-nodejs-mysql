import express from 'express';
import controller from './controller.js';
import { validateClienteData } from './validators.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Crea un nuevo router de Express
const router = express.Router();

// Ruta para listar todos los clientes
// GET /api/clientes
router.get('/', asyncHandler(controller.list));

// Ruta para obtener un cliente específico por ID
// GET /api/clientes/:id
router.get('/:id', asyncHandler(controller.get));

// Ruta para crear un nuevo cliente
// POST /api/clientes
// Usa validateClienteData como middleware para validar los datos de entrada
router.post('/', validateClienteData, asyncHandler(controller.insert));

// Ruta para actualizar un cliente existente
// PUT /api/clientes/:id
// Usa validateClienteData como middleware para validar los datos de entrada
router.put('/:id', validateClienteData, asyncHandler(controller.update));

// Ruta para eliminar un cliente
// DELETE /api/clientes/:id
router.delete('/:id', asyncHandler(controller.remove));

// Exporta el router para ser usado en la aplicación principal
export default router;
