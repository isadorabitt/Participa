/**
 * Remove palavras comuns e stopwords do português
 */
const STOPWORDS = new Set([
  'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por',
  'que', 'é', 'no', 'na', 'se', 'ao', 'mais', 'mas', 'como', 'ou', 'ser',
  'foi', 'são', 'tem', 'ter', 'foi', 'será', 'está', 'estão', 'foi', 'foram',
  'pode', 'pode', 'poder', 'pode', 'poderá', 'pode', 'poderão', 'pode',
  'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
  'aquele', 'aquela', 'aqueles', 'aquelas', 'isso', 'isto', 'aquilo',
  'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas',
  'seu', 'sua', 'seus', 'suas', 'nosso', 'nossa', 'nossos', 'nossas',
  'deles', 'delas', 'dela', 'dele', 'lhe', 'lhes', 'lhe', 'lhes',
  'muito', 'muita', 'muitos', 'muitas', 'pouco', 'pouca', 'poucos', 'poucas',
  'também', 'também', 'também', 'também', 'ainda', 'ainda', 'ainda', 'ainda',
  'já', 'já', 'já', 'já', 'só', 'só', 'só', 'só', 'só', 'só',
  'quando', 'quando', 'quando', 'quando', 'onde', 'onde', 'onde', 'onde',
  'então', 'então', 'então', 'então', 'assim', 'assim', 'assim', 'assim',
]);

/**
 * Remove caracteres especiais e normaliza o texto
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove caracteres especiais
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
};

/**
 * Remove redundâncias do texto
 */
const removeRedundancies = (text: string): string => {
  // Remove frases muito similares
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    const normalized = normalizeText(sentence);
    const isDuplicate = uniqueSentences.some(existing => {
      const existingNormalized = normalizeText(existing);
      // Verifica similaridade simples (palavras em comum)
      const words1 = normalized.split(/\s+/);
      const words2 = existingNormalized.split(/\s+/);
      const commonWords = words1.filter(w => words2.includes(w) && w.length > 3);
      return commonWords.length / Math.max(words1.length, words2.length) > 0.7;
    });
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence.trim());
    }
  }
  
  return uniqueSentences.join('. ');
};


/**
 * Extrai informações essenciais (datas, números, nomes próprios)
 */
const extractEssentialInfo = (text: string): string[] => {
  const essential: string[] = [];
  
  // Datas (dd/mm/yyyy, dd-mm-yyyy, etc)
  const datePattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g;
  const dates = text.match(datePattern);
  if (dates) {
    essential.push(...dates);
  }
  
  // Horários (HH:MM)
  const timePattern = /\d{1,2}:\d{2}/g;
  const times = text.match(timePattern);
  if (times) {
    essential.push(...times);
  }
  
  // Números significativos (mais de 2 dígitos)
  const numberPattern = /\d{3,}/g;
  const numbers = text.match(numberPattern);
  if (numbers) {
    essential.push(...numbers);
  }
  
  // Palavras com maiúscula (possíveis nomes próprios)
  const properNouns = text.match(/\b[A-Z][a-z]+\b/g);
  if (properNouns) {
    essential.push(...properNouns);
  }
  
  return essential;
};

/**
 * Resume um texto mantendo informações essenciais e removendo redundâncias
 * 
 * @param {string} text - Texto a ser resumido
 * @param {number} maxLength - Tamanho máximo do resumo (opcional, padrão: 200 caracteres)
 * @returns {string} Texto resumido
 */
export const summarizeText = (text: string, maxLength: number = 200): string => {
  if (!text || text.trim().length === 0) {
    return '';
  }
  
  // Se o texto já é menor que o máximo, retornar como está
  if (text.length <= maxLength) {
    return text;
  }
  
  // Extrair informações essenciais primeiro
  const essentialInfo = extractEssentialInfo(text);
  
  // Remover redundâncias
  let summarized = removeRedundancies(text);
  
  // Se ainda for muito longo, remover palavras desnecessárias
  if (summarized.length > maxLength) {
    // Dividir em frases e manter as mais importantes
    const sentences = summarized.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const importantSentences: string[] = [];
    let currentLength = 0;
    
    // Priorizar frases com informações essenciais
    const sentencesWithInfo = sentences.map(sentence => ({
      sentence,
      hasInfo: essentialInfo.some(info => sentence.includes(info)),
      length: sentence.length,
    }));
    
    // Ordenar: primeiro as que têm informações essenciais
    sentencesWithInfo.sort((a, b) => {
      if (a.hasInfo && !b.hasInfo) return -1;
      if (!a.hasInfo && b.hasInfo) return 1;
      return 0;
    });
    
    // Adicionar frases até atingir o limite
    for (const { sentence } of sentencesWithInfo) {
      if (currentLength + sentence.length <= maxLength) {
        importantSentences.push(sentence.trim());
        currentLength += sentence.length;
      } else {
        break;
      }
    }
    
    summarized = importantSentences.join('. ');
  }
  
  // Garantir que informações essenciais estejam presentes
  if (essentialInfo.length > 0 && summarized.length < maxLength * 0.8) {
    const missingInfo = essentialInfo.filter(info => !summarized.includes(info));
    if (missingInfo.length > 0) {
      summarized += '. ' + missingInfo.join(', ');
    }
  }
  
  // Limpar espaços extras e garantir que termine com ponto
  summarized = summarized
    .replace(/\s+/g, ' ')
    .trim();
  
  if (summarized.length > maxLength) {
    summarized = summarized.substring(0, maxLength - 3) + '...';
  }
  
  return summarized;
};

/**
 * Conta palavras no texto
 */
export const countWords = (text: string): number => {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Extrai palavras-chave do texto
 */
export const extractKeywords = (text: string, maxKeywords: number = 10): string[] => {
  if (!text || text.trim().length === 0) {
    return [];
  }
  
  const words = normalizeText(text)
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOPWORDS.has(word));
  
  const wordCount: Record<string, number> = {};
  
  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

