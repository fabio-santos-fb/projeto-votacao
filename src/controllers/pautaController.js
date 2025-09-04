export class PautaController {
  constructor(pautaService, userService) {
    this.pautaService = pautaService;
    this.userService = userService;
  }

  createPauta = async (req, res) => {
    const { nome, descricao, tempo_aberta, id_admin } = req.body;
    try {
      await this.userService.isUserAdmin(id_admin);

      var tempoAberta =  tempo_aberta

      if (tempoAberta == null)
        tempoAberta = 1

      const pauta = await this.pautaService.createPauta(nome, descricao, tempoAberta);
      
      res.status(201).json(pauta);
    } catch (err) {
      if (err.message === 'FORBIDDEN') {
        return res.status(400).json({ error: 'Permissão negada, só administrador pode criar pauta.' });
      }

      if (err.message === 'PAUTA_EXISTS') {
        return res.status(409).json({ error: 'Já existe uma pauca com este nome.' });
      }

      console.error(err);
      res.status(500).json({ error: 'Erro ao criar pauta' });
    }
  };

  listPautas = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.pautaService.listPautas(page, limit);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar pautas' });
    }
  };

  getPautaById = async (req, res) => {
    try {
      const { id } = req.params;
      const pauta = await this.pautaService.getPautaById(id);
      res.json(pauta);
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Pauta não encontrada' });
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar pauta' });
    }
  };
}
