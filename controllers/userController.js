const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email); // Verifique se encontra o usuário corretamente
    if (user.length === 0) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar o token ou resposta de sucesso
    res.status(200).json({ message: 'Login bem-sucedido!', user: user[0] });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no login.' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();  // Função que traz todos os dados dos usuários do banco
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};



exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
};

exports.createUser = async (req, res) => {
  const { nome, email, password } = req.body;

  try {
    // Verifica se já existe um utilizador com o mesmo email
    const existingUser = await User.login(email);  // Alterado para usar o método login do modelo
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Encripta a senha antes de guardar no banco de dados
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria e salva o novo utilizador com senha encriptada
    const newUser = {
      nome,
      email,
      password: hashedPassword,
    };

    await User.create(newUser);  // Usando o método create do modelo

    res.status(201).json({ message: 'Utilizador criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({ message: 'Erro ao criar utilizador.' });
  }
};

exports.updateUser = (req, res) => {
  User.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated' });
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted' });
  });
};
