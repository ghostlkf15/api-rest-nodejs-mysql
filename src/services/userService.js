import { db } from '../db/mysql.js';

const TABLE = 'usuarios';

export const userService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const users = await db.list(TABLE);
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  getUserById: async (id) => {
    try {
      const user = await db.get(TABLE, id);
      return user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const userId = await db.insert(TABLE, userData);
      const newUser = await db.get(TABLE, userId);
      return newUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData) => {
    try {
      await db.update(TABLE, { id, ...userData });
      const updatedUser = await db.get(TABLE, id);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      await db.remove(TABLE, id);
      return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
};
