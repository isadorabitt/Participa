import { TextField, Box, Typography, Alert, Chip } from '@mui/material';
import { useReport } from '../context/ReportContext';
import { useEffect, useState } from 'react';
import { detectarDadosPessoais, removerDadosPessoais, type TipoDadoPessoal } from '../utils/detectarDadosPessoais';
import { PersonalDataAlert } from './PersonalDataAlert';

interface TextInputProps {
  label?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
}

export const TextInput = ({
  label = 'Descrição do Registro',
  maxLength = 5000,
  minLength = 10,
  required = true,
}: TextInputProps) => {
  const { report, updateDescription, updateIdentification } = useReport();
  const [characterCount, setCharacterCount] = useState(report.description.length);
  const [showWarning, setShowWarning] = useState(false);
  const [dadosPessoaisDetectados, setDadosPessoaisDetectados] = useState<{
    possui: boolean;
    tipos: TipoDadoPessoal[];
  }>({ possui: false, tipos: [] });
  const [showPersonalDataAlert, setShowPersonalDataAlert] = useState(false);

  useEffect(() => {
    setCharacterCount(report.description.length);
  }, [report.description]);

  // Detectar dados pessoais separadamente
  useEffect(() => {
    if (report.description && report.description.trim().length >= 10) {
      const resultado = detectarDadosPessoais(report.description);
      setDadosPessoaisDetectados({
        possui: resultado.possuiDadosPessoais,
        tipos: resultado.itens,
      });
      
      // Mostrar alerta se detectar dados pessoais e ainda não foi mostrado
      if (resultado.possuiDadosPessoais && !showPersonalDataAlert) {
        // Verificar se já está como identificada
        if (report.identification.type === 'anonymous') {
          setShowPersonalDataAlert(true);
        }
      }
    } else {
      setDadosPessoaisDetectados({ possui: false, tipos: [] });
    }
  }, [report.description, report.identification.type, showPersonalDataAlert]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Permitir até maxLength caracteres
    const truncatedValue = value.length > maxLength ? value.substring(0, maxLength) : value;
    
    if (value.length <= maxLength) {
      updateDescription(truncatedValue);
      setCharacterCount(truncatedValue.length);
      
      // Verificar palavras que podem indicar dados pessoais
      const personalDataKeywords = [
        /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, // CPF
        /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/, // CNPJ
        /\b\d{5}-?\d{3}\b/, // CEP
        /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Cartão de crédito
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
        /\b\d{2}\/?\d{2}\/?\d{4}\b/, // Data de nascimento
      ];
      
      const hasPersonalData = personalDataKeywords.some(regex => regex.test(truncatedValue));
      setShowWarning(hasPersonalData);
    } else {
      // Se exceder, apenas atualizar contador mas não o valor
      setCharacterCount(maxLength);
    }
  };

  const remainingChars = maxLength - characterCount;
  const isNearLimit = remainingChars < 100;
  const isAtLimit = remainingChars === 0;

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        multiline
        rows={8}
        label={label}
        value={report.description}
        onChange={handleChange}
        required={required}
        error={characterCount < minLength && characterCount > 0}
        helperText={
          characterCount < minLength && characterCount > 0
            ? `Mínimo de ${minLength} caracteres necessário`
            : undefined
        }
        aria-label={label}
        aria-describedby="text-input-description text-input-counter"
        inputProps={{
          'aria-required': required,
          maxLength: maxLength,
        }}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: 'inherit',
          },
        }}
      />
      
      <Box
        id="text-input-counter"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 1,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          color={isAtLimit ? 'error' : isNearLimit ? 'warning.main' : 'text.secondary'}
          aria-live="polite"
          aria-atomic="true"
        >
          {characterCount} / {maxLength} caracteres
          {remainingChars > 0 && ` (${remainingChars} restantes)`}
        </Typography>
        
        {report.classification && report.classification.confianca > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${report.classification.tipo} (${report.classification.confianca}% confiança)`}
              size="small"
              color={
                report.classification.tipo === 'Elogio'
                  ? 'success'
                  : report.classification.tipo === 'Reclamação' || report.classification.tipo === 'Denúncia'
                  ? 'error'
                  : report.classification.tipo === 'Solicitação'
                  ? 'primary'
                  : report.classification.tipo === 'Sugestão'
                  ? 'warning'
                  : 'info'
              }
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
              aria-label={`Tipo de manifestação: ${report.classification.tipo} com ${report.classification.confianca}% de confiança`}
            />
          </Box>
        )}
      </Box>

      {showWarning && (
        <Alert severity="warning" sx={{ marginTop: 2 }} role="alert">
          <Typography variant="body2" component="div">
            <strong>Atenção:</strong> Detectamos possíveis dados pessoais no texto. 
            Por segurança, evite incluir CPF, CNPJ, números de cartão, emails ou outras informações pessoais.
          </Typography>
        </Alert>
      )}

      {dadosPessoaisDetectados.possui && (
        <Alert severity="warning" sx={{ marginTop: 2 }} role="alert">
          <Typography variant="body2" component="div">
            <strong>Atenção:</strong> Detectamos dados pessoais no texto: {' '}
            {dadosPessoaisDetectados.tipos.join(', ')}. 
            {report.identification.type === 'anonymous' && (
              <> Considere remover essas informações ou registrar como identificada.</>
            )}
          </Typography>
        </Alert>
      )}

      <Alert severity="info" sx={{ marginTop: 2 }} role="note">
        <Typography variant="body2" id="text-input-description">
          <strong>Importante:</strong> Não inclua dados pessoais sensíveis como CPF, 
          números de cartão de crédito, senhas ou outras informações confidenciais neste campo.
        </Typography>
      </Alert>

      <PersonalDataAlert
        open={showPersonalDataAlert}
        tiposEncontrados={dadosPessoaisDetectados.tipos}
        onConfirmarIdentificado={() => {
          updateIdentification({
            type: 'identified',
            name: undefined,
            email: undefined,
            phone: undefined,
            cpf: undefined,
          });
          setShowPersonalDataAlert(false);
        }}
        onRemoverDados={() => {
          const textoLimpo = removerDadosPessoais(report.description, dadosPessoaisDetectados.tipos);
          updateDescription(textoLimpo);
          setShowPersonalDataAlert(false);
          setDadosPessoaisDetectados({ possui: false, tipos: [] });
        }}
        onCancelar={() => {
          setShowPersonalDataAlert(false);
        }}
      />
    </Box>
  );
};

