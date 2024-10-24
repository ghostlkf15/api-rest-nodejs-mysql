import { db } from '../../db/mysql.js';
import { success, error } from '../../utils/response.js';

const TABLE = 'clientes';

async function list(req, res) {
    try {
        const data = await db.list(TABLE);
        success(req, res, data, "Items encontrados", 200);
    } catch (err) {
        console.error('Error en list:', err);
        error(req, res, 'Error interno del servidor', 500);
    }
}

async function get(req, res) {
    try {
        const { id } = req.params;
        const data = await db.get(TABLE, id);
        if (data) {
            success(req, res, data, "Item encontrado", 200);
        } else {
            error(req, res, "Item no encontrado", 404);
        }
    } catch (err) {
        console.error('Error en get:', err);
        error(req, res, 'Error interno del servidor', 500);
    }
}

async function insert(req, res) {
    try {
        const data = await db.insert(TABLE, req.body);
        success(req, res, data, "Item creado", 201);
    } catch (err) {
        console.error('Error en insert:', err);
        error(req, res, 'Error al crear el item', 500);
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const data = await db.update(TABLE, id, req.body);
        if (data) {
            success(req, res, data, "Item actualizado", 200);
        } else {
            error(req, res, "Item no encontrado", 404);
        }
    } catch (err) {
        console.error('Error en update:', err);
        error(req, res, 'Error al actualizar el item', 500);
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        const data = await db.remove(TABLE, id);
        if (data) {
            success(req, res, data, "Item eliminado", 200);
        } else {
            error(req, res, "Item no encontrado", 404);
        }
    } catch (err) {
        console.error('Error en remove:', err);
        error(req, res, 'Error al eliminar el item', 500);
    }
}

export default {
    list,
    get,
    insert,
    update,
    remove
};
