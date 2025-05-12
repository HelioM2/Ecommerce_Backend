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

// Use variáveis de ambiente para segurança e flexibilidade
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

