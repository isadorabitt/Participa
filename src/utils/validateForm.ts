/**
 * Tipos de validação disponíveis
 */
export type ValidationRule =
  | 'required'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

/**
 * Regra de validação
 */
export interface ValidationRuleConfig {
  type: ValidationRule;
  message?: string;
  value?: number | string | RegExp | ((value: any) => boolean);
}

/**
 * Resultado da validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Valida um campo individual
 */
const validateField = (
  value: any,
  rules: ValidationRuleConfig[]
): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          errors.push(rule.message || 'Este campo é obrigatório');
        }
        break;

      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message || 'Email inválido');
          }
        }
        break;

      case 'phone':
        if (value && typeof value === 'string') {
          // Remove caracteres não numéricos
          const phoneNumbers = value.replace(/\D/g, '');
          if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
            errors.push(rule.message || 'Telefone inválido');
          }
        }
        break;

      case 'cpf':
        if (value && typeof value === 'string') {
          const cpfNumbers = value.replace(/\D/g, '');
          if (cpfNumbers.length !== 11 || !isValidCPF(cpfNumbers)) {
            errors.push(rule.message || 'CPF inválido');
          }
        }
        break;

      case 'minLength':
        if (value && typeof value === 'string') {
          const minLength = typeof rule.value === 'number' ? rule.value : 0;
          if (value.length < minLength) {
            errors.push(
              rule.message || `Mínimo de ${minLength} caracteres necessário`
            );
          }
        }
        break;

      case 'maxLength':
        if (value && typeof value === 'string') {
          const maxLength = typeof rule.value === 'number' ? rule.value : Infinity;
          if (value.length > maxLength) {
            errors.push(
              rule.message || `Máximo de ${maxLength} caracteres permitido`
            );
          }
        }
        break;

      case 'pattern':
        if (value && typeof value === 'string' && rule.value instanceof RegExp) {
          if (!rule.value.test(value)) {
            errors.push(rule.message || 'Formato inválido');
          }
        }
        break;

      case 'custom':
        if (rule.value && typeof rule.value === 'function') {
          const isValid = rule.value(value);
          if (!isValid) {
            errors.push(rule.message || 'Validação customizada falhou');
          }
        }
        break;
    }
  }

  return errors;
};

/**
 * Valida CPF usando algoritmo de validação
 */
const isValidCPF = (cpf: string): boolean => {
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * Configuração de validação para um formulário
 */
export interface FormValidationConfig {
  [fieldName: string]: ValidationRuleConfig[];
}

/**
 * Valida um formulário completo
 * 
 * @param {Record<string, any>} formData - Dados do formulário
 * @param {FormValidationConfig} config - Configuração de validação
 * @returns {ValidationResult} Resultado da validação
 */
export const validateForm = (
  formData: Record<string, any>,
  config: FormValidationConfig
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  for (const [fieldName, rules] of Object.entries(config)) {
    const value = formData[fieldName];
    const fieldErrors = validateField(value, rules);

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida um campo específico
 * 
 * @param {any} value - Valor do campo
 * @param {ValidationRuleConfig[]} rules - Regras de validação
 * @returns {string[]} Lista de erros (vazia se válido)
 */
export const validateFieldValue = (
  value: any,
  rules: ValidationRuleConfig[]
): string[] => {
  return validateField(value, rules);
};

/**
 * Helpers para criar regras de validação comuns
 */
export const validationRules = {
  required: (message?: string): ValidationRuleConfig => ({
    type: 'required',
    message: message || 'Este campo é obrigatório',
  }),

  email: (message?: string): ValidationRuleConfig => ({
    type: 'email',
    message: message || 'Email inválido',
  }),

  phone: (message?: string): ValidationRuleConfig => ({
    type: 'phone',
    message: message || 'Telefone inválido',
  }),

  cpf: (message?: string): ValidationRuleConfig => ({
    type: 'cpf',
    message: message || 'CPF inválido',
  }),

  minLength: (length: number, message?: string): ValidationRuleConfig => ({
    type: 'minLength',
    value: length,
    message: message || `Mínimo de ${length} caracteres necessário`,
  }),

  maxLength: (length: number, message?: string): ValidationRuleConfig => ({
    type: 'maxLength',
    value: length,
    message: message || `Máximo de ${length} caracteres permitido`,
  }),

  pattern: (regex: RegExp, message?: string): ValidationRuleConfig => ({
    type: 'pattern',
    value: regex,
    message: message || 'Formato inválido',
  }),

  custom: (
    validator: (value: any) => boolean,
    message?: string
  ): ValidationRuleConfig => ({
    type: 'custom',
    value: validator,
    message: message || 'Validação customizada falhou',
  }),
};

/**
 * Validação específica para o formulário de registro
 */
export const reportFormValidation: FormValidationConfig = {
  description: [
    validationRules.required('A descrição é obrigatória'),
    validationRules.minLength(10, 'A descrição deve ter no mínimo 10 caracteres'),
    validationRules.maxLength(5000, 'A descrição não pode exceder 5000 caracteres'),
  ],
  email: [
    validationRules.email('Email inválido'),
  ],
  phone: [
    validationRules.phone('Telefone inválido'),
  ],
  cpf: [
    validationRules.cpf('CPF inválido'),
  ],
};

