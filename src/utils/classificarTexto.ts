/**
 * Classificador automático de manifestações baseado em regras heurísticas
 * Identifica o tipo de manifestação sem uso de IA pesada
 */

export type TipoManifestacao =
  | 'Reclamação'
  | 'Solicitação'
  | 'Sugestão'
  | 'Elogio'
  | 'Denúncia'
  | 'Pedido de Informação';

export interface ResultadoClassificacao {
  tipo: TipoManifestacao;
  confianca: number; // 0-100
  motivo: string[];
  tags: string[];
}

// Palavras-chave e padrões para cada tipo de manifestação
const padroes: Record<TipoManifestacao, { palavras: string[]; frases: RegExp[]; peso: number }> = {
  Reclamação: {
    palavras: [
      'reclamo',
      'reclamar',
      'reclamação',
      'reclamações',
      'ruim',
      'péssimo',
      'horrível',
      'terrível',
      'decepcionado',
      'decepcionada',
      'insatisfeito',
      'insatisfeita',
      'problema',
      'problemas',
      'erro',
      'erros',
      'falha',
      'falhas',
      'defeito',
      'defeitos',
      'não funciona',
      'não está funcionando',
      'não atende',
      'atraso',
      'atrasos',
      'demora',
      'demoras',
      'lento',
      'lenta',
      'mau atendimento',
      'atendimento ruim',
      'prejudicado',
      'prejudicada',
      'dificuldade',
      'dificuldades',
      'incomodado',
      'incomodada',
      'preocupado',
      'preocupada',
      'indignado',
      'indignada',
      'revoltado',
      'revoltada',
    ],
    frases: [
      /\bnão\s+(está|esta|estao|estão)\s+funcionando\b/gi,
      /\b(estou|estamos)\s+(insatisfeito|insatisfeita|decepcionado|decepcionada)\b/gi,
      /\b(muito|extremamente)\s+(ruim|péssimo|horrível)\b/gi,
      /\bpreciso\s+reclamar\b/gi,
      /\bvenho\s+(por\s+meio\s+deste|através\s+deste)\s+registro\s+reclamar\b/gi,
    ],
    peso: 1.0,
  },
  Solicitação: {
    palavras: [
      'solicito',
      'solicitar',
      'solicitação',
      'solicitações',
      'pedido',
      'pedir',
      'quero',
      'gostaria',
      'desejo',
      'desejaria',
      'preciso',
      'necessito',
      'necessidade',
      'requer',
      'requerer',
      'requisição',
      'requisições',
      'demando',
      'demandar',
      'demanda',
      'demandas',
      'peço',
      'peça',
      'peçam',
      'solicitamos',
      'solicitamos',
      'venho solicitar',
      'venho pedir',
      'gostaria de solicitar',
      'gostaria de pedir',
      'quero solicitar',
      'quero pedir',
    ],
    frases: [
      /\b(quero|gostaria|desejo|preciso|necessito)\s+(de|solicitar|pedir|obter|conseguir)\b/gi,
      /\bvenho\s+(por\s+meio\s+deste|através\s+deste)\s+(solicitar|pedir|requerer)\b/gi,
      /\bsolicito\s+(que|o|a|os|as)\b/gi,
      /\bpeço\s+(que|o|a|os|as)\b/gi,
      /\b(por\s+favor|por\s+gentileza)\s+(solicito|peço|quero)\b/gi,
    ],
    peso: 1.0,
  },
  Sugestão: {
    palavras: [
      'sugestão',
      'sugestões',
      'sugiro',
      'sugerir',
      'sugerimos',
      'proposta',
      'propostas',
      'proponho',
      'propor',
      'recomendação',
      'recomendações',
      'recomendo',
      'recomendar',
      'ideia',
      'ideias',
      'melhoria',
      'melhorias',
      'sugiro que',
      'sugerimos que',
      'proponho que',
      'recomendo que',
      'seria bom',
      'seria melhor',
      'poderia ser',
      'sugiro melhorias',
    ],
    frases: [
      /\b(sugiro|sugerimos|proponho|propusemos)\s+(que|o|a|os|as)\b/gi,
      /\bseria\s+(bom|melhor|interessante|útil)\s+(se|que)\b/gi,
      /\bpoderia\s+(ser|haver|ter|fazer)\b/gi,
      /\b(tenho|temos)\s+uma\s+(sugestão|proposta|ideia|recomendação)\b/gi,
      /\b(melhoria|melhorias|otimização|otimizações)\s+(para|em|no|na)\b/gi,
    ],
    peso: 1.0,
  },
  Elogio: {
    palavras: [
      'elogio',
      'elogios',
      'elogiar',
      'parabéns',
      'parabenizo',
      'parabenizar',
      'parabéns pelo',
      'parabéns pela',
      'parabéns pelos',
      'parabéns pelas',
      'ótimo',
      'ótima',
      'excelente',
      'maravilhoso',
      'maravilhosa',
      'fantástico',
      'fantástica',
      'incrível',
      'perfeito',
      'perfeita',
      'satisfeito',
      'satisfeita',
      'satisfação',
      'gostei',
      'gostamos',
      'adorei',
      'adorei',
      'muito bom',
      'muito boa',
      'muito bem',
      'atendimento excelente',
      'serviço excelente',
      'trabalho excelente',
      'reconheço',
      'reconhecemos',
      'reconhecimento',
      'agradeço',
      'agradecemos',
      'agradecimento',
      'agradecimentos',
    ],
    frases: [
      /\b(parabéns|parabenizo|parabenizamos)\s+(pelo|pela|pelos|pelas|ao|à|aos|às)\b/gi,
      /\b(estou|estamos)\s+(muito|extremamente)\s+(satisfeito|satisfeita|feliz|contento|contente)\b/gi,
      /\b(gostei|gostamos|adorei|adorei)\s+(muito|bastante|demais)\b/gi,
      /\b(ótimo|excelente|maravilhoso|fantástico|incrível)\s+(trabalho|atendimento|serviço)\b/gi,
      /\b(quero|gostaria)\s+(de|de)\s+(elogiar|parabenizar|agradecer)\b/gi,
    ],
    peso: 1.0,
  },
  Denúncia: {
    palavras: [
      'denúncia',
      'denúncias',
      'denuncio',
      'denunciar',
      'denunciamos',
      'irregularidade',
      'irregularidades',
      'ilegal',
      'ilegais',
      'ilegalidade',
      'ilegalidades',
      'corrupção',
      'corrupto',
      'corrupta',
      'fraude',
      'fraudes',
      'desvio',
      'desvios',
      'desvio de recursos',
      'desvio de verba',
      'desvio de dinheiro',
      'má gestão',
      'má administração',
      'negligência',
      'negligências',
      'omissão',
      'omissões',
      'abuso',
      'abusos',
      'abuso de poder',
      'abuso de autoridade',
      'violação',
      'violações',
      'violação de direito',
      'violação de direitos',
      'crime',
      'crimes',
      'criminoso',
      'criminosa',
      'suspeito',
      'suspeita',
      'suspeitas',
    ],
    frases: [
      /\bvenho\s+(por\s+meio\s+deste|através\s+deste)\s+denunciar\b/gi,
      /\bdenuncio\s+(a|o|as|os|uma|um)\s+(irregularidade|ilegalidade|fraude|crime)\b/gi,
      /\b(irregularidade|ilegalidade|fraude|crime|corrupção)\s+(em|no|na|nos|nas)\b/gi,
      /\b(desvio|desvios)\s+(de\s+)?(recursos|verba|dinheiro|fundos)\b/gi,
      /\b(abuso|abusos)\s+(de\s+)?(poder|autoridade|função)\b/gi,
    ],
    peso: 1.2, // Peso maior para denúncias (mais crítico)
  },
  'Pedido de Informação': {
    palavras: [
      'informação',
      'informações',
      'dúvida',
      'dúvidas',
      'dúvido',
      'pergunta',
      'perguntas',
      'perguntar',
      'quero saber',
      'gostaria de saber',
      'desejo saber',
      'preciso saber',
      'quando',
      'onde',
      'como',
      'por que',
      'porque',
      'por quê',
      'qual',
      'quais',
      'quanto',
      'quantos',
      'quantas',
      'quem',
      'o que',
      'qual é',
      'quais são',
      'como funciona',
      'como fazer',
      'como obter',
      'como conseguir',
      'onde encontrar',
      'onde obter',
      'quando será',
      'quando vai ser',
      'quando acontece',
      'quando acontecerá',
      'horário',
      'horários',
      'local',
      'locais',
      'endereço',
      'endereços',
      'telefone',
      'telefones',
      'contato',
      'contatos',
      'documento',
      'documentos',
      'requisito',
      'requisitos',
      'exigência',
      'exigências',
    ],
    frases: [
      /\b(quero|gostaria|desejo|preciso|necessito)\s+(saber|conhecer|obter|ter)\s+(informação|informações|dados)\b/gi,
      /\b(quando|onde|como|por\s+que|porque|qual|quais|quanto|quantos|quantas|quem)\s+(será|vai\s+ser|acontece|acontecerá|funciona|fazer|obter|conseguir|encontrar)\b/gi,
      /\b(como|onde|quando)\s+(funciona|fazer|obter|conseguir|encontrar|será|vai\s+ser)\b/gi,
      /\b(tenho|temos)\s+(uma|algumas)\s+(dúvida|dúvidas|pergunta|perguntas)\b/gi,
      /\bpreciso\s+(de|das|do|dos)\s+(informação|informações|dados|documentos)\b/gi,
    ],
    peso: 1.0,
  },
};

/**
 * Normaliza o texto para análise
 */
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

/**
 * Calcula o tom do texto (positivo, negativo, neutro)
 */
function calcularTom(texto: string): { positivo: number; negativo: number; neutro: number } {
  const palavrasPositivas = [
    'bom',
    'boa',
    'ótimo',
    'ótima',
    'excelente',
    'maravilhoso',
    'fantástico',
    'perfeito',
    'satisfeito',
    'feliz',
    'gostei',
    'adorei',
    'parabéns',
    'elogio',
    'recomendo',
  ];
  const palavrasNegativas = [
    'ruim',
    'péssimo',
    'horrível',
    'terrível',
    'decepcionado',
    'insatisfeito',
    'problema',
    'erro',
    'falha',
    'defeito',
    'reclamo',
    'revoltado',
    'indignado',
  ];

  const textoNormalizado = normalizarTexto(texto);
  const palavras = textoNormalizado.split(/\s+/);

  let positivo = 0;
  let negativo = 0;

  palavras.forEach((palavra) => {
    if (palavrasPositivas.some((p) => palavra.includes(p))) {
      positivo++;
    }
    if (palavrasNegativas.some((p) => palavra.includes(p))) {
      negativo++;
    }
  });

  const total = positivo + negativo;
  const neutro = total === 0 ? 1 : 0;

  return { positivo, negativo, neutro };
}

/**
 * Classifica o texto da manifestação
 */
export function classificarTexto(texto: string): ResultadoClassificacao {
  if (!texto || texto.trim().length < 10) {
    return {
      tipo: 'Pedido de Informação',
      confianca: 0,
      motivo: ['Texto muito curto para classificação'],
      tags: [],
    };
  }

  const textoNormalizado = normalizarTexto(texto);
  const palavras = textoNormalizado.split(/\s+/);
  const tom = calcularTom(texto);

  // Pontuação para cada tipo
  const pontuacoes: Record<TipoManifestacao, { pontos: number; motivos: string[]; tags: string[] }> = {
    Reclamação: { pontos: 0, motivos: [], tags: [] },
    Solicitação: { pontos: 0, motivos: [], tags: [] },
    Sugestão: { pontos: 0, motivos: [], tags: [] },
    Elogio: { pontos: 0, motivos: [], tags: [] },
    Denúncia: { pontos: 0, motivos: [], tags: [] },
    'Pedido de Informação': { pontos: 0, motivos: [], tags: [] },
  };

  // Verificar palavras-chave
  Object.entries(padroes).forEach(([tipo, padrao]) => {
    const tipoKey = tipo as TipoManifestacao;

    // Verificar palavras individuais
    padrao.palavras.forEach((palavra) => {
      const regex = new RegExp(`\\b${palavra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(textoNormalizado)) {
        pontuacoes[tipoKey].pontos += padrao.peso * 10;
        pontuacoes[tipoKey].motivos.push(`palavra-chave: "${palavra}"`);
        pontuacoes[tipoKey].tags.push(palavra);
      }
    });

    // Verificar frases/padrões
    padrao.frases.forEach((frase) => {
      if (frase.test(texto)) {
        pontuacoes[tipoKey].pontos += padrao.peso * 15;
        pontuacoes[tipoKey].motivos.push(`padrão identificado`);
        pontuacoes[tipoKey].tags.push('padrão');
      }
    });
  });

  // Ajustar pontuação baseado no tom
  if (tom.positivo > tom.negativo && tom.positivo > 0) {
    pontuacoes.Elogio.pontos += tom.positivo * 5;
    pontuacoes.Elogio.motivos.push(`tom positivo (${tom.positivo} palavras)`);
  }

  if (tom.negativo > tom.positivo && tom.negativo > 0) {
    pontuacoes.Reclamação.pontos += tom.negativo * 5;
    pontuacoes.Reclamação.motivos.push(`tom negativo (${tom.negativo} palavras)`);
  }

  // Verificar palavras interrogativas (Pedido de Informação)
  const palavrasInterrogativas = palavras.filter((p) =>
    ['quando', 'onde', 'como', 'por', 'qual', 'quais', 'quanto', 'quantos', 'quantas', 'quem', 'o que'].includes(p)
  );
  if (palavrasInterrogativas.length > 0) {
    pontuacoes['Pedido de Informação'].pontos += palavrasInterrogativas.length * 8;
    pontuacoes['Pedido de Informação'].motivos.push(
      `palavras interrogativas: ${palavrasInterrogativas.slice(0, 3).join(', ')}`
    );
  }

  // Encontrar o tipo com maior pontuação
  let tipoClassificado: TipoManifestacao = 'Pedido de Informação';
  let maiorPontuacao = 0;

  Object.entries(pontuacoes).forEach(([tipo, dados]) => {
    if (dados.pontos > maiorPontuacao) {
      maiorPontuacao = dados.pontos;
      tipoClassificado = tipo as TipoManifestacao;
    }
  });

  // Calcular confiança (0-100)
  const totalPontos = Object.values(pontuacoes).reduce((sum, p) => sum + p.pontos, 0);
  const confianca = totalPontos > 0 ? Math.min(100, Math.round((maiorPontuacao / totalPontos) * 100)) : 0;

  // Ajustar confiança baseado na diferença entre primeiro e segundo
  const pontuacoesOrdenadas = Object.entries(pontuacoes)
    .map(([tipo, dados]) => ({ tipo: tipo as TipoManifestacao, pontos: dados.pontos }))
    .sort((a, b) => b.pontos - a.pontos);

  if (pontuacoesOrdenadas.length >= 2) {
    const diferenca = pontuacoesOrdenadas[0].pontos - pontuacoesOrdenadas[1].pontos;
    if (diferenca > 0) {
      const bonusConfianca = Math.min(20, diferenca / 2);
      const confiancaFinal = Math.min(100, confianca + bonusConfianca);
      return {
        tipo: tipoClassificado,
        confianca: Math.round(confiancaFinal),
        motivo: pontuacoes[tipoClassificado].motivos.slice(0, 3),
        tags: [...new Set(pontuacoes[tipoClassificado].tags)].slice(0, 5),
      };
    }
  }

  return {
    tipo: tipoClassificado,
    confianca: Math.round(confianca),
    motivo: pontuacoes[tipoClassificado].motivos.slice(0, 3),
    tags: [...new Set(pontuacoes[tipoClassificado].tags)].slice(0, 5),
  };
}

