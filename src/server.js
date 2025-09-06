import express from 'express';
import { swaggerSpec, swaggerUi } from './swagger.js';
import userRoutes from './routes/userRoutes.js';
import pautaRoutes from './routes/pautaRoutes.js';
import votoRoutes from './routes/votoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

const app = express();
app.use(express.json());

// CORS manual
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas

app.use('/v1/votos', votoRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/pautas', pautaRoutes);
app.use('/v1/categorias', categoriaRoutes);

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
  console.log('Swagger disponível em http://localhost:3000/api-docs');
});
