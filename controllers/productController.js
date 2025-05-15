const { error, Console } = require('console');
const db = require('../config/db');

// Atualizar produto
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantidade, categoria } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, quantidade = ?, categoria = ?, image = ? WHERE id = ?',
      [name, description, price, quantidade, categoria, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Obter lista de produtos
exports.getCategoriasProdutos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,name FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o Produto' });
  }
};

// Obter lista de sizes
exports.getCategoriasUnicas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sizes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tamanho' });
  }
};
// Obter lista de cores
exports.getUniqueCores = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM colors');
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar cores:', err);
    res.status(500).json({ error: 'Erro ao buscar cores' });
  }
};

// Obter lista de cores para ProductDetails
exports.getUniqueCoresDetails = async (req, res) => {
  const productId = req.params.id;  // Obtém o ID do produto passado na URL
  try {
    const [results] = await db.query('SELECT c.name FROM colors c INNER JOIN product_variants pv ON pv.color_id = c.id where pv.product_id = ?;', [productId]);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar cores:', err);
    res.status(500).json({ error: 'Erro ao buscar cores' });
  }
};

// Obter lista de Tamanhos para ProductDetails
exports.getUniqueSizeDetails = async (req, res) => {
  const productId = req.params.id;  // Obtém o ID do produto passado na URL
  try {
    const [results] = await db.query('SELECT c.name FROM sizes c INNER JOIN product_variants pv ON pv.size_id = c.id where pv.product_id = ?;', [productId]);
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar cores:', err);
    res.status(500).json({ error: 'Erro ao buscar cores' });
  }
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto por ID." });
  }
};

exports.getCategoriasCores = async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT DISTINCT tamanho FROM gerirprodutos');
    const [cores] = await db.query('SELECT DISTINCT cor FROM gerirprodutos');
    res.json({ categorias, cores });
    // console.log("CORES:", cores);
    // console.log("CATEGORIAS:", categorias);
  } catch (error) {
    console.error('❌ ERRO DETALHADO:', error); // <--- Aqui imprime o erro completo no terminal
    res.status(500).json({ error: 'Erro ao buscar categorias e cores' });
  }
};

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).array('images', 10); // Aceitando até 10 arquivos

// // Criar produto
// exports.createProduct = async (req, res) => {
//   console.log('Entrou');
//   const { name, description, price, categoria } = req.body;

//   if (!name || !description || !price || !categoria || !req.files || req.files.length === 0) {
//     return res.status(400).json({ error: 'Todos os campos são obrigatórios e devem incluir pelo menos uma imagem!' });
//   }

//   const imageFilenames = req.files.map(file => file.filename).join(',');

//   try {

//     const [result] = await db.query(
//       'INSERT INTO products (name, description, price, categoria, image) VALUES (?, ?, ?, ?, ?)',
//       [name, description, price, categoria, imageFilenames]
//     );
//     res.status(201).json({ message: 'Produto criado com sucesso', id: result.insertId });
//   } catch (err) {
//     console.error('Erro ao criar produto:', err);
//     res.status(500).json({ error: 'Erro ao criar produto' });
//   }
// };

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

// Criar produto
exports.createProduct = async (req, res) => {
  console.log('Entrou');
  const { name, description, price, categoria } = req.body;

  if (!name || !description || !price || !categoria || !req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios e devem incluir pelo menos uma imagem!' });
  }

  const processedFilenames = [];

  try {
    // Processar cada imagem
    for (const file of req.files) {
      const inputPath = path.join(__dirname, '../uploads/', file.filename);
      const outputPath = path.join(__dirname, '../uploads/', `no-bg-${file.filename}`);

      const formData = new FormData();
      formData.append('image_file', fs.createReadStream(inputPath));
      formData.append('size', 'auto');

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        responseType: 'arraybuffer',
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': 'pF3k8kbB5Z7MUzwTxLQRS1TM',
        },
      });

      fs.writeFileSync(outputPath, response.data);
      processedFilenames.push(`no-bg-${file.filename}`);

      // Opcional: remover imagem original
      fs.unlinkSync(inputPath);
    }

    const imageFilenames = processedFilenames.join(',');

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, categoria, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, categoria, imageFilenames]
    );

    res.status(201).json({ message: 'Produto criado com sucesso', id: result.insertId });

  } catch (err) {
    console.error('Erro ao processar ou criar produto:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// Criar Banner
exports.createBanner = async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const FormData = require('form-data'); // certifica-te que tens este import
  const axios = require('axios');

  console.log('Entrou createBanner');
  console.log('req.file:', req.file);
  console.log('req.files:', req.files);

  const { titulo, slogam } = req.body;

  if (!titulo || !slogam || !req.file) {
    return res.status(400).json({ error: 'Título, slogam e uma imagem são obrigatórios!' });
  }

  try {
    // Verifica ou cria a pasta de uploads
    const uploadsDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const file = req.file;
    const inputPath = path.join(uploadsDir, file.filename);
    const outputPath = path.join(uploadsDir, `no-bg-${file.filename}`);
    console.log("Caminho real de saída:", outputPath);

    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(inputPath));
    formData.append('size', 'auto');

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': 'pF3k8kbB5Z7MUzwTxLQRS1TM',
      },
    });

    fs.writeFileSync(outputPath, response.data);
    fs.unlinkSync(inputPath); // apaga original

    // Insere no banco de dados
    const [result] = await db.query(
      'INSERT INTO img_banner (titulo, slogam, imagem, estado) VALUES (?, ?, ?, ?)',
      [titulo, slogam, `no-bg-${file.filename}`, 0]
    );

    res.status(201).json({ message: 'Banner criado com sucesso!', id: result.insertId });

  } catch (err) {
    console.error('Erro ao processar ou criar banner:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao criar banner' });
  }
};


// Criar detalhes dos produtos
exports.createDetalheProduto = async (req, res) => {
  const { product_id, color_id, size_id, stock } = req.body;

  if (!product_id || !color_id || !size_id || !stock) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  console.log('Produto id selecionado:', req.body.product_id);

  try {
    const [result] = await db.query(
      'INSERT INTO product_variants (product_id, color_id, size_id, stock) VALUES (?, ?, ?, ?)',
      [product_id, color_id, size_id, stock]
    );
    res.status(201).json({ message: 'Produto criado com sucesso', id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// Criar Tamanho do Produto
exports.createSizeProduct = async (req, res) => {
  const { tamanho } = req.body;

  if (!tamanho) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  // console.log('cor selecionado:', req.body.cor);

  try {
    const [result] = await db.query(
      'INSERT INTO sizes (name) VALUES (?)',
      [tamanho]
    );
    res.status(201).json({ message: 'Tamanho criado com sucesso', id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar Tamanho:', err);
    res.status(500).json({ error: 'Erro ao criar Tamanho' });
  }
};

// Criar cor do Produto
exports.createColorProduct = async (req, res) => {
  const { cor } = req.body;

  if (!cor) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  // console.log('cor selecionado:', req.body.cor);

  try {
    const [result] = await db.query(
      'INSERT INTO colors (name) VALUES (?)',
      [cor]
    );
    res.status(201).json({ message: 'Cor criado com sucesso', id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar a cor:', err);
    res.status(500).json({ error: 'Erro ao criar a cor' });
  }
};


// Criar Categoria
exports.createCategoria = async (req, res) => {
  const { tamanho, cor } = req.body;
  if (!tamanho || !cor) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO gerirprodutos (tamanho, cor) VALUES (?, ?)',
      [tamanho, cor]
    );
    res.status(201).json({ message: 'Categoria criado com sucesso', id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ error: 'Erro ao criar Categoria' });
  }
};


// Listar produtos
exports.getAllProducts = async (req, res) => {
  console.log('Requisição recebida no GET /api/product');
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Listar Banner
exports.getAllBanner = async (req, res) => {
  console.log('Requisição recebida no GET /api/banner');
  try {
    const [results] = await db.query('SELECT * FROM img_banner');
    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar Banners:', err);
    res.status(500).json({ error: 'Erro ao buscar Banners' });
  }
};

// Atualizar produtos
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?  WHERE id = ?',
      [name, description, price, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Atualizar produtos
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto eliminado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao eliminar produto' });
  }
};

