import express from 'express';
import { swaggerSpec, swaggerUi } from './swagger.js';
import userRoutes from './routes/userRoutes.js';
import pautaRoutes from './routes/pautaRoutes.js';
import votoRoutes from './routes/votoRoutes.js';

const app = express();
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas

app.use('/votos', votoRoutes);
app.use('/users', userRoutes);
app.use('/pautas', pautaRoutes);

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
  console.log('Swagger disponível em http://localhost:3000/api-docs');
});
