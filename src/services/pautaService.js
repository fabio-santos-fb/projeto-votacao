export class PautaService {
  constructor(pautaRepository) {
    this.pautaRepository = pautaRepository;
  }

  async createPauta(nome, descricao, tempoAberta = 1) {
    const exists = await this.pautaRepository.findByNome(nome);
    
    if (exists) {
      throw new Error('PAUTA_EXISTS');
    }

    return await this.pautaRepository.create(nome, descricao, tempoAberta);
  }

  async listPautas(page, limit) {
    const { pautas, total } = await this.pautaRepository.findAllPaginated(page, limit);

    const now = new Date();

    const pautasFormatadas = pautas.map(pauta => {
      const dataInicio = new Date(pauta.created_at);
      const dataFim = new Date(dataInicio.getTime() + pauta.tempo_aberta * 60000);
      const status = now <= dataFim ? 'aberta' : 'encerrada';

      const tempoRestanteMs = Math.max(dataFim - now, 0);
      const tempoRestanteMin = Math.floor(tempoRestanteMs / 60000);

      return {
        id: pauta.id,
        nome: pauta.nome,
        descricao: pauta.descricao,
        status,
        tempo_restante: status === 'aberta' ? `${tempoRestanteMin} min` : '0 min',
      };
    });

    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      pautas: pautasFormatadas,
    };
  }

  async getPautaById(id) {
    const pauta = await this.pautaRepository.findById(id);
    if (!pauta) {
      throw new Error('NOT_FOUND');
    }

    return this.formatPauta(pauta, new Date());
  }

  formatPauta(pauta, now) {
    const dataInicio = new Date(pauta.created_at);
    const dataFim = new Date(dataInicio.getTime() + pauta.tempo_aberta * 60000);
    const status = now <= dataFim ? 'aberta' : 'encerrada';

    const tempoRestanteMs = Math.max(dataFim - now, 0);
    const tempoRestanteMin = Math.floor(tempoRestanteMs / 60000);

    return {
      id: pauta.id,
      nome: pauta.nome,
      descricao: pauta.descricao,
      status,
      tempo_restante: status === 'aberta' ? `${tempoRestanteMin} min` : '0 min',
    };
  }
}
