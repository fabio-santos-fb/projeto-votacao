import { UserService } from '../../../src/services/userService.js';
import { isValidCPF } from '../../../src/validators/cpfValidator.js';

jest.mock('../../../src/validators/cpfValidator.js');

describe('UserService', () => {
  let userRepositoryMock;
  let userService;

  beforeEach(() => {
    userRepositoryMock = {
      findByCpf: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    userService = new UserService(userRepositoryMock);
    isValidCPF.mockReset();
  });

  describe('createUser', () => {
    it('should throw INVALID_CPF if CPF is invalid', async () => {
      isValidCPF.mockReturnValue(false);

      await expect(userService.createUser('12345678900', 'admin'))
        .rejects
        .toThrow('INVALID_CPF');
    });

    it('should throw INVALID_TYPE if tipo is invalid', async () => {
      isValidCPF.mockReturnValue(true);

      await expect(userService.createUser('52998224725', 'superuser'))
        .rejects
        .toThrow('INVALID_TYPE');
    });

    it('should throw CPF_EXISTS if CPF is already registered', async () => {
      isValidCPF.mockReturnValue(true);
      userRepositoryMock.findByCpf.mockResolvedValue({ cpf: '52998224725' });

      await expect(userService.createUser('52998224725', 'admin'))
        .rejects
        .toThrow('CPF_EXISTS');
    });

    it('should create a new user if CPF and tipo are valid', async () => {
      isValidCPF.mockReturnValue(true);
      userRepositoryMock.findByCpf.mockResolvedValue(null);
      const fakeUser = { id: 'uuid-123', cpf: '52998224725', tipo: 'admin' };
      userRepositoryMock.create.mockResolvedValue(fakeUser);

      const result = await userService.createUser('529.982.247-25', 'admin');

      expect(userRepositoryMock.create).toHaveBeenCalledWith('52998224725', 'admin');
      expect(result).toEqual(fakeUser);
    });
  });

  describe('listUsers', () => {
    it('should return all users', async () => {
      const fakeUsers = [
        { id: 'uuid1', cpf: '52998224725', tipo: 'admin' },
        { id: 'uuid2', cpf: '12345678909', tipo: 'comum' }
      ];
      userRepositoryMock.findAll.mockResolvedValue(fakeUsers);

      const result = await userService.listUsers();

      expect(result).toEqual(fakeUsers);
      expect(userRepositoryMock.findAll).toHaveBeenCalled();
    });
  });
});
