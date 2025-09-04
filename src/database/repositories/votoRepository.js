import { pool } from '../db.js';

export class VotoRepository {
  async create(cpf, pautaId, voto) {
    const result = await pool.query(
      'INSERT INTO votos (cpf, pauta_id, voto) VALUES ($1, $2, $3) RETURNING *',
      [cpf, pautaId, voto]
    );
    return result.rows[0];
  }

  async findByCpfAndPauta(cpf, pautaId) {
    const result = await pool.query(
      'SELECT * FROM votos WHERE cpf = $1 AND pauta_id = $2',
      [cpf, pautaId]
    );
    return result.rows[0];
  }

  async countVotesByPauta(idPauta) {
    const result = await pool.query(
      `SELECT
          COUNT(*) FILTER (WHERE voto = 'sim')::int AS sim,
          COUNT(*) FILTER (WHERE voto = 'nao')::int AS nao
        FROM votos
        WHERE pauta_id = $1`,
      [idPauta]
    );
    return result.rows[0];
  }
}
