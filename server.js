const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configurar CORS
// app.use(cors({
//   origin: 'http://localhost:3000', // origem do teu frontend
//   credentials: true // permite envio de cookies e headers como Authorization
// }));

// Configuração do CORS
app.use(cors({
  origin: 'https://ecommerce-frontend-wheat-psi.vercel.app/', // URL do seu frontend hospedado no Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization']  // Cabeçalhos permitidos
}));

// Outros middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/uploads', express.static('uploads'));


// As tuas rotas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/users', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api', orderRoutes);

// Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor backend rodando na porta 5000');
});

