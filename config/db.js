// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ecommerce',
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// module.exports = pool;

const mysql = require('mysql2/promise');
require('dotenv').config();

// Use variáveis de ambiente para segurança e flexibilidade
const pool = mysql.createPool({
  host: 'mainline.proxy.rlwy.net' || 'localhost',
  user: 'root',
  password: 'hvdEOrCmNdUDzlzbGjMLdyDAHnVeedZF' || '',
  database: 'railway' || 'ecommerce',
  port: 30130 || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Teste de conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados bem-sucedida!');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

testConnection();

module.exports = pool;

