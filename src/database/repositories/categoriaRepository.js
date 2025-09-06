import { pool } from '../db.js';

export class CategoriaRepository {
  async criar(nome) {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return result.rows[0];
  }

  async listar() {
    const result = await pool.query(
      'SELECT * FROM categorias ORDER BY nome ASC'
    );
    return result.rows;
  }

  async buscarPorNome(nome) {
    const result = await pool.query(
      'SELECT * FROM categorias WHERE nome = $1',
      [nome]
    );
    return result.rows[0];
  }
}
