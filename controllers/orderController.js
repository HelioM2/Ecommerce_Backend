const db = require('../config/db');

// Criar pedidos
exports.createPedido = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity] // Correção: use os campos corretos
    );
    res.status(201).json({ message: 'Pedido criado com sucesso', id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar Pedido:', err);
    res.status(500).json({ error: 'Erro ao criar Pedido' });
  }
};

exports.pedidosPorTempo = async (req, res) => {
  try {
      const [rows] = await db.query(`
          SELECT 
              DATE(created_at) AS dia,
              COUNT(*) AS total_pedidos
          FROM orders
          GROUP BY dia
          ORDER BY dia ASC
      `);

      res.json(rows);
  } catch (error) {
      console.error('Erro ao buscar pedidos por tempo:', error);
      res.status(500).json({ error: 'Erro ao buscar dados de pedidos' });
  }
};

// Listar pedidos
exports.getAllPedido = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM orders');
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar Pedido:', err);
    res.status(500).json({ error: 'Erro ao buscar Pedido' });
  }
};

// Atualizar pedidos
exports.updatePedido = async (req, res) => {
  const { id } = req.params;
  const { user_id, product_id, quantity } = req.body;  // Corrigir: use os campos corretos

  try {
    const [result] = await db.query(
      'UPDATE orders SET user_id = ?, product_id = ?, quantity = ? WHERE id = ?',
      [user_id, product_id, quantity, id] // Use os dados corretos
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar Pedido:', err);
    res.status(500).json({ error: 'Erro ao atualizar Pedido' });
  }
};

// Deletar pedidos
exports.deletePedido = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido eliminado com sucesso' });
  } catch (err) {
    console.error('Erro ao eliminar Pedido:', err);  // Corrigir mensagem de erro
    res.status(500).json({ error: 'Erro ao eliminar Pedido' });
  }
};
