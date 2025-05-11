const express = require('express');
const router = express.Router();

// Importa o controlador de pedidos
const orderController = require('../controllers/orderController'); 

// Rota GET - Listar todos os pedidos
router.get('/orders', orderController.getAllPedido);
router.get('/orders/por-tempo', orderController.pedidosPorTempo);

// Rota POST - Criar um novo pedido
router.post('/', orderController.createPedido);

// Rota PUT - Atualizar um pedido
router.put('/:id', orderController.updatePedido);

// Rota DELETE - Eliminar um pedido
router.delete('/:id', orderController.deletePedido);

module.exports = router;
