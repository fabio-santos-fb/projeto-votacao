import { pool } from '../db.js';

export class PautaRepository {
  async create(nome, descricao, tempoAberta) {
    const result = await pool.query(
      'INSERT INTO pautas (nome, descricao, tempo_aberta) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, tempoAberta]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query('SELECT * FROM pautas');
    return result.rows;
  }

  async findById(pautaId) {
    const result = await pool.query(
      'SELECT * FROM pautas WHERE id = $1',
      [pautaId]
    );
    return result.rows[0];
  }

  async findByNome(nome) {
    const result = await pool.query(
      'SELECT * FROM pautas WHERE nome = $1',
      [nome]
    );
    return result.rows[0];
  }

  async findAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM pautas ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM pautas');
    const total = parseInt(totalResult.rows[0].count, 10);

    return {
      pautas: result.rows,
      total,
    };
  }
}
