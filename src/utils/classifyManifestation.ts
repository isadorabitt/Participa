/**
 * Classificador automático de manifestações baseado em regras heurísticas
 * Identifica o tipo de manifestação sem usar IA pesada
 */

export type ManifestationType =
  | 'Reclamação'
  | 'Solicitação'
  | 'Sugestão'
  | 'Elogio'
  | 'Denúncia'
  | 'Pedido de Informação';

export interface ClassificationResult {
  tipo: ManifestationType;
  confianca: number;
  motivo: string[];
  tags: string[];
}

// Palavras-chave e padrões para cada tipo
const KEYWORDS = {
  Reclamação: [
    'reclamo',
    'reclamar',
    'reclamação',
    'reclamações',
    'ruim',
    'péssimo',
    'horrível',
    'terrível',
    'decepcionado',
    'decepcionante',
    'insatisfeito',
    'insatisfação',
    'problema',
    'problemas',
    'erro',
    'erros',
    'falha',
    'falhas',
    'defeito',
    'defeitos',
    'não funciona',
    'não funcionou',
    'não está funcionando',
    'lento',
    'demorado',
    'atraso',
    'atrasos',
    'inadequado',
    'inadequada',
    'precário',
    'precária',
    'mau atendimento',
    'atendimento ruim',
    'não gostei',
    'não recomendo',
    'péssima qualidade',
    'qualidade ruim',
  ],
  Solicitação: [
    'solicito',
    'solicitar',
    'solicitação',
    'solicitações',
    'pedir',
    'pedido',
    'pedidos',
    'quero',
    'gostaria',
    'preciso',
    'necessito',
    'requer',
    'requerer',
    'requisição',
    'requisições',
    'solicitar',
    'solicito que',
    'gostaria de solicitar',
    'quero pedir',
    'preciso de',
    'necessito de',
    'favor',
    'por favor',
    'solicito a',
    'solicito o',
    'solicito a',
  ],
  Sugestão: [
    'sugiro',
    'sugerir',
    'sugestão',
    'sugestões',
    'proponho',
    'propor',
    'proposta',
    'propostas',
    'sugiro que',
    'sugiro a',
    'sugiro o',
    'seria bom',
    'seria interessante',
    'seria melhor',
    'poderia',
    'poderia ser',
    'sugestão de',
    'ideia',
    'ideias',
    'recomendo',
    'recomendação',
    'recomendações',
    'melhoria',
    'melhorias',
    'otimizar',
    'otimização',
  ],
  Elogio: [
    'elogio',
    'elogiar',
    'elogios',
    'parabéns',
    'parabenizo',
    'parabenizar',
    'ótimo',
    'excelente',
    'maravilhoso',
    'maravilhosa',
    'perfeito',
    'perfeita',
    'muito bom',
    'muito boa',
    'satisfeito',
    'satisfeita',
    'satisfação',
    'gostei',
    'gostei muito',
    'adorei',
    'recomendo',
    'recomendaria',
    'atendimento excelente',
    'atendimento ótimo',
    'qualidade excelente',
    'qualidade ótima',
    'profissional',
    'profissionais',
    'competente',
    'competentes',
    'eficiente',
    'eficientes',
    'rápido',
    'rápida',
    'agilidade',
    'agil',
  ],
  Denúncia: [
    'denuncio',
    'denunciar',
    'denúncia',
    'denúncias',
    'irregularidade',
    'irregularidades',
    'ilegal',
    'ilegais',
    'ilegalidade',
    'ilegalidades',
    'corrupção',
    'corrupto',
    'corrupta',
    'desvio',
    'desvios',
    'fraude',
    'fraudes',
    'fraudulento',
    'fraudulenta',
    'irregular',
    'irregulares',
    'violação',
    'violações',
    'violar',
    'violou',
    'infração',
    'infrações',
    'crime',
    'crimes',
    'criminoso',
    'criminosa',
    'abusivo',
    'abusiva',
    'abuso',
    'abusos',
    'omissão',
    'omissões',
    'negligência',
    'negligente',
    'descumprimento',
    'descumprimentos',
    'não cumpre',
    'não cumpriu',
    'não está cumprindo',
  ],
  'Pedido de Informação': [
    'informação',
    'informações',
    'quero saber',
    'gostaria de saber',
    'preciso saber',
    'quando',
    'onde',
    'como',
    'o que',
    'qual',
    'quais',
    'quanto',
    'quantos',
    'quantas',
    'como funciona',
    'como é',
    'como fazer',
    'quando vai ser',
    'quando será',
    'onde fica',
    'onde está',
    'qual é',
    'quais são',
    'preciso de informação',
    'solicito informação',
    'quero informação',
    'gostaria de informação',
    'dúvida',
    'dúvidas',
    'desejo saber',
    'desejo informações',
  ],
};

// Termos que indicam tom negativo (aumentam confiança para Reclamação/Denúncia)
const NEGATIVE_TONE = [
  'não',
  'nunca',
  'jamais',
  'ninguém',
  'nada',
  'nenhum',
  'nenhuma',
  'falta',
  'faltou',
  'faltando',
  'ausência',
  'ausente',
  'inexistente',
  'inexistência',
];

// Termos que indicam tom positivo (aumentam confiança para Elogio)
const POSITIVE_TONE = [
  'muito',
  'muito bem',
  'muito bom',
  'muito boa',
  'extremamente',
  'totalmente',
  'completamente',
  'perfeitamente',
  'excelentemente',
  'sempre',
  'sempre foi',
  'sempre é',
];

// Termos críticos que aumentam urgência/severidade
const CRITICAL_TERMS = [
  'urgente',
  'urgência',
  'emergência',
  'emergencial',
  'grave',
  'graves',
  'gravidade',
  'sério',
  'séria',
  'seriedade',
  'crítico',
  'crítica',
  'criticidade',
  'imediato',
  'imediatamente',
  'agora',
  'já',
  'hoje',
];

/**
 * Normaliza o texto para análise
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

/**
 * Conta ocorrências de palavras-chave no texto
 */
function countKeywords(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  let count = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    // Busca exata da palavra
    const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
}

/**
 * Analisa o tom do texto
 */
function analyzeTone(text: string): { isNegative: boolean; isPositive: boolean; criticalCount: number } {
  const normalized = normalizeText(text);
  
  const negativeCount = countKeywords(normalized, NEGATIVE_TONE);
  const positiveCount = countKeywords(normalized, POSITIVE_TONE);
  const criticalCount = countKeywords(normalized, CRITICAL_TERMS);

  return {
    isNegative: negativeCount > 0,
    isPositive: positiveCount > 0,
    criticalCount,
  };
}

/**
 * Classifica o tipo de manifestação baseado em regras heurísticas
 */
export function classificarTexto(texto: string): ClassificationResult {
  if (!texto || texto.trim().length < 10) {
    return {
      tipo: 'Solicitação',
      confianca: 50,
      motivo: ['Texto muito curto para classificação precisa'],
      tags: ['texto-curto'],
    };
  }

  // const normalizedText = normalizeText(texto); // Não usado no momento
  const scores: Record<ManifestationType, number> = {
    Reclamação: 0,
    Solicitação: 0,
    Sugestão: 0,
    Elogio: 0,
    Denúncia: 0,
    'Pedido de Informação': 0,
  };

  const motivo: string[] = [];
  const tags: string[] = [];

  // Conta palavras-chave para cada tipo
  for (const [tipo, keywords] of Object.entries(KEYWORDS)) {
    const count = countKeywords(texto, keywords);
    scores[tipo as ManifestationType] = count * 10; // Cada palavra-chave vale 10 pontos

    if (count > 0) {
      motivo.push(`palavra-chave: ${keywords.slice(0, 2).join(', ')} (${count}x)`);
      tags.push(`keyword-${tipo.toLowerCase()}`);
    }
  }

  // Analisa o tom do texto
  const tone = analyzeTone(texto);

  // Ajusta scores baseado no tom
  if (tone.isNegative) {
    scores.Reclamação += 15;
    scores.Denúncia += 10;
    motivo.push('tom negativo detectado');
    tags.push('tom-negativo');
  }

  if (tone.isPositive) {
    scores.Elogio += 20;
    motivo.push('tom positivo detectado');
    tags.push('tom-positivo');
  }

  if (tone.criticalCount > 0) {
    scores.Denúncia += tone.criticalCount * 5;
    scores.Reclamação += tone.criticalCount * 3;
    motivo.push(`termos críticos: ${tone.criticalCount}`);
    tags.push('termos-criticos');
  }

  // Padrões específicos de contexto
  // Pedido de Informação: perguntas
  const questionPatterns = [
    /\?/g, // Contém interrogação
    /\b(quando|onde|como|o que|qual|quais|quanto|quantos|quantas)\b/gi,
  ];
  
  let questionCount = 0;
  for (const pattern of questionPatterns) {
    const matches = texto.match(pattern);
    if (matches) {
      questionCount += matches.length;
    }
  }

  if (questionCount > 0) {
    scores['Pedido de Informação'] += questionCount * 15;
    motivo.push(`perguntas detectadas: ${questionCount}`);
    tags.push('contem-perguntas');
  }

  // Sugestão: padrões de proposta
  const suggestionPatterns = [
    /\b(seria|poderia|deveria|sugiro|proponho)\b/gi,
    /\b(melhorar|otimizar|implementar|adicionar|incluir)\b/gi,
  ];

  let suggestionCount = 0;
  for (const pattern of suggestionPatterns) {
    const matches = texto.match(pattern);
    if (matches) {
      suggestionCount += matches.length;
    }
  }

  if (suggestionCount > 0) {
    scores.Sugestão += suggestionCount * 12;
    motivo.push(`padrões de sugestão: ${suggestionCount}`);
    tags.push('padrao-sugestao');
  }

  // Encontra o tipo com maior score
  let maxScore = 0;
  let selectedType: ManifestationType = 'Solicitação';

  for (const [tipo, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedType = tipo as ManifestationType;
    }
  }

  // Calcula confiança (0-100)
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  let confianca = 50; // Base

  if (totalScore > 0) {
    // Confiança baseada na diferença entre o primeiro e segundo lugar
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const difference = sortedScores[0] - (sortedScores[1] || 0);
    
    // Se a diferença é grande, aumenta a confiança
    confianca = Math.min(95, 50 + Math.floor(difference / 2));
    
    // Se o score é muito alto, aumenta confiança
    if (maxScore > 30) {
      confianca = Math.min(95, confianca + 10);
    }
  }

  // Se não encontrou muitas palavras-chave, reduz confiança
  if (maxScore < 10) {
    confianca = Math.max(30, confianca - 20);
    motivo.push('poucas palavras-chave encontradas');
  }

  return {
    tipo: selectedType,
    confianca: Math.round(confianca),
    motivo: motivo.length > 0 ? motivo : ['Classificação baseada em padrões gerais'],
    tags: tags.length > 0 ? tags : ['classificacao-generica'],
  };
}

