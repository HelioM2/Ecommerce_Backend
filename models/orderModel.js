const db = require('../config/db');

const Order = {
  // Criar pedido
  create: async (user_id, product_id, quantity) => {
    try {
      const [result] = await db.query(
        'INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
      return result;
    } catch (error) {
      throw new Error('Erro ao criar pedido: ' + error.message);
    }
  },

  // Buscar todos os pedidos
  getAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM orders');
      return results;
    } catch (error) {
      throw new Error('Erro ao buscar pedidos: ' + error.message);
    }
  },

  // Buscar pedido por ID
  getById: async (id) => {
    try {
      const [result] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw new Error('Erro ao buscar pedido: ' + error.message);
    }
  },

  // Atualizar pedido
  update: async (id, user_id, product_id, quantity) => {
    try {
      const [result] = await db.query(
        'UPDATE orders SET user_id = ?, product_id = ?, quantity = ? WHERE id = ?',
        [user_id, product_id, quantity, id]
      );
      return result;
    } catch (error) {
      throw new Error('Erro ao atualizar pedido: ' + error.message);
    }
  },

  // Deletar pedido
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw new Error('Erro ao deletar pedido: ' + error.message);
    }
  }
};

module.exports = Order;
