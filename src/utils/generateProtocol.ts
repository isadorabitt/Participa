/**
 * Gera um protocolo único no formato: OUV-XXXXX/YYYY
 * onde XXXXX é um número sequencial de 5 dígitos e YYYY é o ano atual
 * 
 * @returns {string} Protocolo no formato OUV-XXXXX/YYYY
 */
export const generateProtocol = (): string => {
  const currentYear = new Date().getFullYear();
  
  // Obter o último número de protocolo usado (armazenado no localStorage)
  const storageKey = 'participa_last_protocol_number';
  let lastNumber = 0;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        lastNumber = parsed;
      }
    }
  } catch (error) {
    console.warn('Erro ao ler último número de protocolo:', error);
  }
  
  // Incrementar o número
  const nextNumber = lastNumber + 1;
  
  // Garantir que o número tenha 5 dígitos (preencher com zeros à esquerda)
  const protocolNumber = nextNumber.toString().padStart(5, '0');
  
  // Salvar o novo número
  try {
    localStorage.setItem(storageKey, nextNumber.toString());
  } catch (error) {
    console.warn('Erro ao salvar número de protocolo:', error);
  }
  
  // Formatar: OUV-XXXXX/YYYY
  return `OUV-${protocolNumber}/${currentYear}`;
};

/**
 * Valida se uma string está no formato de protocolo válido
 * 
 * @param {string} protocol - Protocolo a ser validado
 * @returns {boolean} true se o protocolo está no formato correto
 */
export const isValidProtocolFormat = (protocol: string): boolean => {
  const protocolRegex = /^OUV-\d{5}\/\d{4}$/;
  return protocolRegex.test(protocol);
};

/**
 * Extrai o número do protocolo
 * 
 * @param {string} protocol - Protocolo no formato OUV-XXXXX/YYYY
 * @returns {number | null} Número do protocolo ou null se inválido
 */
export const extractProtocolNumber = (protocol: string): number | null => {
  if (!isValidProtocolFormat(protocol)) {
    return null;
  }
  
  const match = protocol.match(/^OUV-(\d{5})\/\d{4}$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
};

/**
 * Extrai o ano do protocolo
 * 
 * @param {string} protocol - Protocolo no formato OUV-XXXXX/YYYY
 * @returns {number | null} Ano do protocolo ou null se inválido
 */
export const extractProtocolYear = (protocol: string): number | null => {
  if (!isValidProtocolFormat(protocol)) {
    return null;
  }
  
  const match = protocol.match(/^OUV-\d{5}\/(\d{4})$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
};

