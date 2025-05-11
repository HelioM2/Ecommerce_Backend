const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoints
router.get('/', userController.getAllUsers); // Certifique-se de que userController.getAllUsers é uma função
router.post('/api/users', userController.createUser);
router.post('/api/login', userController.login);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router; // <-- ISTO É ESSENCIAL
 

module.exports = router;
