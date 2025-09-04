import { UserController } from '../../../src/controllers/userController.js';

describe('UserController', () => {
  let userServiceMock;
  let userController;
  let req;
  let res;

  beforeEach(() => {
    userServiceMock = {
      createUser: jest.fn(),
      listUsers: jest.fn(),
    };

    userController = new UserController(userServiceMock);

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createUser', () => {
    it('should return 201 and user if creation succeeds', async () => {
      req.body = { cpf: '52998224725', tipo: 'admin' };
      const fakeUser = { id: 'uuid-123', cpf: '52998224725', tipo: 'admin' };
      userServiceMock.createUser.mockResolvedValue(fakeUser);

      await userController.createUser(req, res);

      expect(userServiceMock.createUser).toHaveBeenCalledWith('52998224725', 'admin');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });

    it('should return 400 if CPF is invalid', async () => {
      req.body = { cpf: '123', tipo: 'admin' };
      userServiceMock.createUser.mockRejectedValue(new Error('INVALID_CPF'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF inválido' });
    });

    it('should return 400 if tipo is invalid', async () => {
      req.body = { cpf: '52998224725', tipo: 'superuser' };
      userServiceMock.createUser.mockRejectedValue(new Error('INVALID_TYPE'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Tipo inválido. Use admin ou comum' });
    });

    it('should return 409 if CPF already exists', async () => {
      req.body = { cpf: '52998224725', tipo: 'admin' };
      userServiceMock.createUser.mockRejectedValue(new Error('CPF_EXISTS'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'CPF já cadastrado' });
    });

    it('should return 500 for unexpected errors', async () => {
      req.body = { cpf: '52998224725', tipo: 'admin' };
      const error = new Error('Something went wrong');
      userServiceMock.createUser.mockRejectedValue(error);
      console.error = jest.fn(); // evitar log no teste

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor' });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('listUsers', () => {
    it('should return users list', async () => {
      const fakeUsers = [
        { id: 'uuid1', cpf: '52998224725', tipo: 'admin' },
        { id: 'uuid2', cpf: '12345678909', tipo: 'comum' },
      ];
      userServiceMock.listUsers.mockResolvedValue(fakeUsers);

      await userController.listUsers(req, res);

      expect(userServiceMock.listUsers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });
  });
});
