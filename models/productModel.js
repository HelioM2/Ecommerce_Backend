const db = require('../config/db');
const { createCategoria } = require('../controllers/productController');

const Product = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM img_banner');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (product) => {
    const { titulo, slogam, imagem, estado } = product;
    console.log('Criando banner:', product);

    const [result] = await db.query(
      'INSERT INTO img_banner (titulo, slogam, imagem, estado) VALUES (?, ?, ?, ?)',
      [titulo, slogam, imagem, estado]
    );

    return { id: result.insertId, ...product };
  },

  create: async (product) => {
    const { name, description, price, quantidade, categoria, cor, image } = product;
    const [result] = await db.query(
      'INSERT INTO products (name, description, price,	quantidade, categoria, cor, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, quantidade, categoria, cor, image]
    );
    return { id: result.insertId, ...product };
  },
  
  
  create: async (product_detalhes) => {
    const { product_id, color_id, size_id, stock } = product_detalhes;
    console.log('produtoID no Models: ',product_id);
    const [result] = await db.query(
      'INSERT INTO product_variants (product_id, color_id, size_id, stock) VALUES (?, ?, ?, ?)',
      [product_id, color_id, size_id, stock]
    );
    return { id: result.insertId, ...product_detalhes };
  },

   create: async (size) => {
    const { tamanho } = size;
    const [result] = await db.query(
      'INSERT INTO sizes (name) VALUES (?)',
      [tamanho]
    );
    return { id: result.insertId, ...size };
  },

    create: async (color) => {
    const { cor } = color;
    const [result] = await db.query(
      'INSERT INTO colors (name) VALUES (?)',
      [cor]
    );
    return { id: result.insertId, ...color };
  },

  create: async (product) => {
    const { tamanho, cor} = product;
    const [result] = await db.query(
      'INSERT INTO gerirprodutos (tamanho, cor) VALUES (?, ?)',
      [tamanho, cor]
    );
    return { id: result.insertId, ...product };
  },


  update: async (id, product) => {
    const { name, description, price, image } = product;
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [name, description, price, image, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
  }
};

module.exports = Product;
