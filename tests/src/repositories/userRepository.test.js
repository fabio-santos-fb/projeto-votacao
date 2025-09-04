import { UserRepository } from '../../../src/database/repositories/userRepository.js';
import { pool } from '../../../src/database/db.js';

jest.mock('../../../src/database/db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    pool.query.mockReset();
  });

  describe('create', () => {
    it('should insert a user and return it', async () => {
      const fakeUser = { id: 'uuid-123', cpf: '52998224725', tipo: 'admin' };
      pool.query.mockResolvedValue({ rows: [fakeUser] });

      const result = await userRepository.create('52998224725', 'admin');

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (cpf, tipo) VALUES ($1, $2) RETURNING *',
        ['52998224725', 'admin']
      );
      expect(result).toEqual(fakeUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const fakeUsers = [
        { id: 'uuid1', cpf: '52998224725', tipo: 'admin' },
        { id: 'uuid2', cpf: '12345678909', tipo: 'comum' }
      ];
      pool.query.mockResolvedValue({ rows: fakeUsers });

      const result = await userRepository.findAll();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
      expect(result).toEqual(fakeUsers);
    });
  });

  describe('findByCpf', () => {
    it('should return the user matching the CPF', async () => {
      const fakeUser = { id: 'uuid-123', cpf: '52998224725', tipo: 'admin' };
      pool.query.mockResolvedValue({ rows: [fakeUser] });

      const result = await userRepository.findByCpf('52998224725');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE cpf = $1',
        ['52998224725']
      );
      expect(result).toEqual(fakeUser);
    });

    it('should return undefined if no user found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.findByCpf('00000000000');

      expect(result).toBeUndefined();
    });
  });
});
