const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Lista de domínios autorizados
const allowedOrigins = [
  'http://localhost:3000'
];

// Configuração do CORS com verificação dinâmica de origem
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Permite chamadas sem origem (Postman, etc.)
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Outros middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// Importação de rotas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Definição das rotas
app.use('/api/users', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api', orderRoutes);

// Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor backend rodando na porta 5000');
});
