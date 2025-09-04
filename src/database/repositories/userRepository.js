import { pool } from '../db.js';

export class UserRepository {
  async create(cpf, tipo) {
    const result = await pool.query(
      'INSERT INTO users (cpf, tipo) VALUES ($1, $2) RETURNING *',
      [cpf, tipo]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findByCpf(cpf) {
    const result = await pool.query(
      'SELECT * FROM users WHERE cpf = $1',
      [cpf]
    );
    return result.rows[0];
  }

  async findById(id_admin) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 and tipo = $2',
      [id_admin, "admin"]
    );
    return result.rows[0];
  }
}
