import express from 'express';
import controller from './controller.js';
import { validateClienteData } from './validators.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = express.Router();

// Listar todos los clientes
router.get('/', asyncHandler(controller.list));

// Obtener un cliente por ID
router.get('/:id', asyncHandler(controller.get));

// Crear un nuevo cliente
router.post('/', validateClienteData, asyncHandler(controller.insert));

// Actualizar un cliente existente
router.put('/:id', validateClienteData, asyncHandler(controller.update));

// Eliminar un cliente
router.delete('/:id', asyncHandler(controller.remove));

export default router;
