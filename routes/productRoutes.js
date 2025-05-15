const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer'); 
const path = require('path');

// Configurar armazenamento de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
     filename: (req, file, cb) => {
    // Gera o nome do arquivo com base no timestamp e extensão do arquivo
    const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
    const filename = `${Date.now()}${ext}`; // Nome único com timestamp e extensão
    cb(null, filename); // Salva com o nome gerado
  }
});

const upload = multer({ storage: storage });


router.get('/cores', productController.getUniqueCores);
router.get('/categorias', productController.getCategoriasUnicas);
router.get('/artigo', productController.getCategoriasProdutos);
router.get('/coresDetails/:id', productController.getUniqueCoresDetails);
router.get('/productSize/:id', productController.getUniqueSizeDetails);

// Rota GET - Listar todos os produtos
router.get('/', productController.getAllProducts);

// Rota GET - Produto específico por ID (depois das rotas específicas acima)
router.get('/:id', productController.getProductById);

// Rota Get de produtos
router.post('/create', upload.array('images'), productController.createProduct);
router.post('/create_banner', upload.single('imagem'), productController.createBanner);
router.post('/create_size', productController.createSizeProduct);
router.post('/create_color', productController.createColorProduct);
router.post('/categoria', productController.createCategoria);
router.post('/createVariants', productController.createDetalheProduto);
router.get('/categoriainfo', productController.getCategoriasCores);


// Rota UPDATE - Alterar o produto
router.put('/:id', upload.single('image'), productController.updateProduct);

// Rota DELETE - Eliminar o produto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
