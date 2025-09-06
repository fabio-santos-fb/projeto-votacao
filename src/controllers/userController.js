export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  createUserAdmin = async (req, res) => {
    const { cpf } = req.body;

    try {
      const user = await this.userService.createUser(cpf, "admin");
      res.status(201).json(user);
    } catch (err) {
      if (err.message === 'INVALID_CPF') {
        return res.status(400).json({ error: 'CPF inválido' });
      }
      if (err.message === 'INVALID_TYPE') {
        return res.status(400).json({ error: 'Tipo inválido. Use admin ou comum' });
      }
      if (err.message === 'CPF_EXISTS') {
        return res.status(409).json({ error: 'CPF já cadastrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  };

  createUserVoters = async (req, res) => {
    const { cpf, id_admin } = req.body;

    try {
      await this.userService.isUserAdmin(id_admin);

      const user = await this.userService.createUser(cpf, "votante");
      res.status(201).json(user);
    } catch (err) {
      if (err.message === 'FORBIDDEN') {
        return res.status(400).json({ error: 'Permissão negada, só administrador pode registrar usuários votantes.' });
      }
      if (err.message === 'INVALID_CPF') {
        return res.status(400).json({ error: 'CPF inválido' });
      }
      if (err.message === 'CPF_EXISTS') {
        return res.status(409).json({ error: 'CPF já cadastrado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  };

  listUsers = async (req, res) => {
    const users = await this.userService.listUsers();
    res.json(users);
  };

  buscarPorCpf = async (req, res) => {
    try {
      const { cpf } = req.params;

      const usuario = await this.userService.buscarPorCpf(cpf);
      return res.json(usuario);
    } catch (err) {
      if (err.message === 'INVALID_CPF') {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      if (err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'Usuário não encontrada' });
      }

      return res.status(400).json({ message: err.message });
    }
  }
}
