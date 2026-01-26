/**
 * Detector automático de dados pessoais sensíveis (LGPD)
 * Identifica dados pessoais no texto para proteção e conformidade
 */

export type TipoDadoPessoal =
  | 'CPF'
  | 'RG'
  | 'Telefone'
  | 'E-mail'
  | 'Nome Completo'
  | 'Endereço';

export interface ResultadoDetecao {
  possuiDadosPessoais: boolean;
  itens: TipoDadoPessoal[];
  detalhes: {
    tipo: TipoDadoPessoal;
    valor: string;
    posicao: number;
  }[];
}

/**
 * Padrões regex para detecção de dados pessoais
 */
const padroes: Record<TipoDadoPessoal, RegExp[]> = {
  CPF: [
    /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, // Formato: 123.456.789-00 ou 12345678900
    /\b\d{11}\b/g, // 11 dígitos consecutivos (pode ser CPF)
  ],
  RG: [
    /\b\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}\b/g, // Formato: 12.345.678-9 ou 123456789
    /\bRG\s*:?\s*\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}\b/gi, // RG: 12.345.678-9
    /\bRegistro\s+Geral\s*:?\s*\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}\b/gi,
  ],
  Telefone: [
    /\b\(?\d{2}\)?\s?\d{4,5}-?\d{4}\b/g, // (11) 98765-4321 ou 11987654321
    /\b\d{10,11}\b/g, // 10 ou 11 dígitos (pode ser telefone)
    /\b(?:telefone|tel|celular|cel|whatsapp|whats)\s*:?\s*\(?\d{2}\)?\s?\d{4,5}-?\d{4}\b/gi,
  ],
  'E-mail': [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // email@dominio.com
    /\b(?:email|e-mail|correio)\s*:?\s*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  ],
  'Nome Completo': [
    /\b[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ]+\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ]+)*\b/g, // Nome com sobrenome(s)
    /\b(?:meu\s+nome|nome\s+completo|me\s+chamo|sou)\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ]+\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ]+/gi,
  ],
  Endereço: [
    /\b(?:rua|avenida|av|travessa|alameda|praça|estrada|rodovia)\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ\s]+(?:,\s*)?(?:nº|numero|n°|#)?\s*\d+\b/gi,
    /\bCEP\s*:?\s*\d{5}-?\d{3}\b/gi, // CEP: 12345-678
    /\b\d{5}-?\d{3}\b/g, // CEP sem prefixo
    /\b(?:bairro|distrito|município|municipio|cidade)\s+[A-ZÁÉÍÓÚÂÊÔÇ][a-záéíóúâêôçãõ\s]+/gi,
  ],
};

/**
 * Valida se um CPF tem formato válido (algoritmo de validação)
 */
function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // Todos os dígitos iguais
  
  let soma = 0;
  let resto;
  
  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  
  return true;
}

/**
 * Valida se um número de telefone tem formato válido
 */
function validarTelefone(telefone: string): boolean {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  // Telefone fixo: 10 dígitos (DDD + 8 dígitos)
  // Celular: 11 dígitos (DDD + 9 dígitos começando com 9)
  if (telefoneLimpo.length === 10) {
    return /^\d{2}[2-9]\d{7}$/.test(telefoneLimpo);
  }
  if (telefoneLimpo.length === 11) {
    return /^\d{2}9\d{8}$/.test(telefoneLimpo);
  }
  
  return false;
}

/**
 * Detecta dados pessoais no texto
 */
export function detectarDadosPessoais(texto: string): ResultadoDetecao {
  if (!texto || texto.trim().length === 0) {
    return {
      possuiDadosPessoais: false,
      itens: [],
      detalhes: [],
    };
  }

  const itensEncontrados: Set<TipoDadoPessoal> = new Set();
  const detalhes: ResultadoDetecao['detalhes'] = [];

  // Detectar CPF
  padroes.CPF.forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        if (validarCPF(match)) {
          itensEncontrados.add('CPF');
          detalhes.push({
            tipo: 'CPF',
            valor: match,
            posicao: texto.indexOf(match),
          });
        }
      });
    }
  });

  // Detectar RG
  padroes.RG.forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        itensEncontrados.add('RG');
        detalhes.push({
          tipo: 'RG',
          valor: match,
          posicao: texto.indexOf(match),
        });
      });
    }
  });

  // Detectar Telefone
  padroes.Telefone.forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const telefoneLimpo = match.replace(/\D/g, '');
        // Evitar falsos positivos (não confundir com CPF ou outros números)
        if (telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11 && validarTelefone(match)) {
          // Verificar se não é um CPF
          if (!validarCPF(match)) {
            itensEncontrados.add('Telefone');
            detalhes.push({
              tipo: 'Telefone',
              valor: match,
              posicao: texto.indexOf(match),
            });
          }
        }
      });
    }
  });

  // Detectar E-mail
  padroes['E-mail'].forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        itensEncontrados.add('E-mail');
        detalhes.push({
          tipo: 'E-mail',
          valor: match,
          posicao: texto.indexOf(match),
        });
      });
    }
  });

  // Detectar Nome Completo (apenas se tiver pelo menos 2 palavras com maiúscula)
  padroes['Nome Completo'].forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const palavras = match.trim().split(/\s+/);
        // Considerar nome completo apenas se tiver 2 ou mais palavras
        if (palavras.length >= 2) {
          // Verificar se não é apenas uma frase comum
          const palavrasComuns = ['meu nome', 'nome completo', 'me chamo', 'sou'];
          const matchLower = match.toLowerCase();
          const isComum = palavrasComuns.some((comum) => matchLower.includes(comum));
          
          if (!isComum || palavras.length >= 3) {
            itensEncontrados.add('Nome Completo');
            detalhes.push({
              tipo: 'Nome Completo',
              valor: match,
              posicao: texto.indexOf(match),
            });
          }
        }
      });
    }
  });

  // Detectar Endereço
  padroes.Endereço.forEach((regex) => {
    const matches = texto.match(regex);
    if (matches) {
      matches.forEach((match) => {
        itensEncontrados.add('Endereço');
        detalhes.push({
          tipo: 'Endereço',
          valor: match,
          posicao: texto.indexOf(match),
        });
      });
    }
  });

  return {
    possuiDadosPessoais: itensEncontrados.size > 0,
    itens: Array.from(itensEncontrados),
    detalhes: detalhes.sort((a, b) => a.posicao - b.posicao),
  };
}

/**
 * Remove dados pessoais do texto
 */
export function removerDadosPessoais(texto: string, tipos: TipoDadoPessoal[]): string {
  let textoLimpo = texto;
  const resultado = detectarDadosPessoais(texto);

  resultado.detalhes.forEach((detalhe) => {
    if (tipos.includes(detalhe.tipo)) {
      // Substituir por [DADO REMOVIDO]
      textoLimpo = textoLimpo.replace(detalhe.valor, `[${detalhe.tipo} REMOVIDO]`);
    }
  });

  return textoLimpo;
}

