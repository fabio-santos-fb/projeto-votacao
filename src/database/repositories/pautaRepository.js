import { pool } from '../db.js';

export class PautaRepository {
  async create(nome, descricao, tempoAberta, categoria) {
    const result = await pool.query(
      'INSERT INTO pautas (nome, descricao, tempo_aberta, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, descricao, tempoAberta, categoria]
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

  async findAllPaginated(page, limit, categoria) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM pautas WHERE categoria = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [categoria, limit, offset]
    );

    const totalResult = await pool.query('SELECT COUNT(*) FROM pautas WHERE categoria = $1', [categoria]);
    const total = parseInt(totalResult.rows[0].count, 10);

    return {
      pautas: result.rows,
      total,
    };
  }
}
