const db = require('../config/db');

const User = {

   // Função para login
   login: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);  // Retorna os resultados da consulta
      });
    });
  },

  create: async (data) => {
    try {
      // Encriptar a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Substitui a senha no objeto com a senha encriptada
      data.password = hashedPassword;

      const [result] = await db.query('INSERT INTO users SET ?', data);
      return result;  // Retorna o resultado da inserção
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
 
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      return rows;  // Retorna os dados da consulta
    } catch (error) {
      throw new Error('Erro ao buscar utilizadores');
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];  // Retorna o primeiro usuário encontrado
    } catch (error) {
      console.error('Erro ao buscar usuário por id:', error);
      throw error;
    }
  },

  // create: async (data) => {
  //   try {
  //     const [result] = await db.query('INSERT INTO users SET ?', data);
  //     return result;  // Retorna o resultado da inserção
  //   } catch (error) {
  //     console.error('Erro ao criar usuário:', error);
  //     throw error;
  //   }
  // },

  update: async (id, data) => {
    try {
      const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
      return result;  // Retorna o resultado da atualização
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      return result;  // Retorna o resultado da exclusão
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};

module.exports = User;
