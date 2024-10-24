import { userService } from '../services/userService.js';
import { success, error } from '../utils/response.js';

export const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      success(req, res, users, 'Usuarios obtenidos con éxito');
    } catch (err) {
      error(req, res, 'Error al obtener usuarios', 500, err);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        success(req, res, user, 'Usuario obtenido con éxito');
      } else {
        error(req, res, 'Usuario no encontrado', 404);
      }
    } catch (err) {
      error(req, res, 'Error al obtener usuario', 500, err);
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      success(req, res, newUser, 'Usuario creado con éxito', 201);
    } catch (err) {
      error(req, res, 'Error al crear usuario', 500, err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (updatedUser) {
        success(req, res, updatedUser, 'Usuario actualizado con éxito');
      } else {
        error(req, res, 'Usuario no encontrado', 404);
      }
    } catch (err) {
      error(req, res, 'Error al actualizar usuario', 500, err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await userService.deleteUser(req.params.id);
      success(req, res, null, 'Usuario eliminado con éxito');
    } catch (err) {
      error(req, res, 'Error al eliminar usuario', 500, err);
    }
  }
};
