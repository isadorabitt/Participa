import { useReport } from '../context/ReportContext';
import { useEffect, useState } from 'react';
import { detectarDadosPessoais, removerDadosPessoais, type TipoDadoPessoal } from '../utils/detectarDadosPessoais';
import { PersonalDataAlert } from './PersonalDataAlert';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
}

const CLASSIFICATION_VARIANT: Record<string, 'success' | 'destructive' | 'default' | 'warning' | 'info'> = {
  Elogio: 'success',
  Reclamação: 'destructive',
  Denúncia: 'destructive',
  Solicitação: 'default',
  Sugestão: 'warning',
  Informação: 'info',
};

const DEFAULT_PLACEHOLDER =
  'Ex.: Em 15/01/2026, no ponto de ônibus da QNN 12, o veículo da linha 0.123 não parou no horário previsto. Descreva data, local e o que aconteceu.';

export const TextInput = ({
  label = 'Descrição do Registro',
  placeholder = DEFAULT_PLACEHOLDER,
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

  useEffect(() => {
    if (report.description && report.description.trim().length >= 10) {
      const resultado = detectarDadosPessoais(report.description);
      setDadosPessoaisDetectados({
        possui: resultado.possuiDadosPessoais,
        tipos: resultado.itens,
      });
      if (resultado.possuiDadosPessoais && !showPersonalDataAlert) {
        if (report.identification.type === 'anonymous') {
          setShowPersonalDataAlert(true);
        }
      }
    } else {
      setDadosPessoaisDetectados({ possui: false, tipos: [] });
    }
  }, [report.description, report.identification.type, showPersonalDataAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const truncatedValue = value.length > maxLength ? value.substring(0, maxLength) : value;

    if (value.length <= maxLength) {
      updateDescription(truncatedValue);
      setCharacterCount(truncatedValue.length);

      const personalDataKeywords = [
        /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
        /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/,
        /\b\d{5}-?\d{3}\b/,
        /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/,
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        /\b\d{2}\/?\d{2}\/?\d{4}\b/,
      ];
      const hasPersonalData = personalDataKeywords.some((regex) => regex.test(truncatedValue));
      setShowWarning(hasPersonalData);
    } else {
      setCharacterCount(maxLength);
    }
  };

  const remainingChars = maxLength - characterCount;
  const isNearLimit = remainingChars < 100;
  const isAtLimit = remainingChars === 0;
  const hasMinError = characterCount < minLength && characterCount > 0;

  return (
    <div className="w-full">
      <Label htmlFor="description" className={required ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}>
        {label}
      </Label>
      <Textarea
        id="description"
        value={report.description}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        maxLength={maxLength}
        aria-describedby="text-input-description text-input-counter"
        rows={8}
        className={cn('mt-2 min-h-[200px] resize-y border-2 bg-white shadow-sm', hasMinError && 'border-destructive focus-visible:ring-destructive')}
      />

      <div
        id="text-input-counter"
        className="mt-2 flex flex-wrap items-center justify-between gap-2"
      >
        <span
          role="status"
          aria-live="polite"
          aria-atomic
          className={cn(
            'text-sm',
            isAtLimit && 'text-destructive',
            isNearLimit && !isAtLimit && 'text-amber-600',
            !isNearLimit && !isAtLimit && 'text-muted-foreground'
          )}
        >
          {characterCount} / {maxLength} caracteres
          {remainingChars > 0 && ` (${remainingChars} restantes)`}
        </span>

        {report.classification && report.classification.confianca > 0 && (
          <Badge
            variant={CLASSIFICATION_VARIANT[report.classification.tipo] ?? 'default'}
            aria-label={`Tipo de manifestação: ${report.classification.tipo} com ${report.classification.confianca}% de confiança`}
          >
            {report.classification.tipo} ({report.classification.confianca}% confiança)
          </Badge>
        )}
      </div>

      {hasMinError && (
        <p className="mt-1 text-sm text-destructive">
          Mínimo de {minLength} caracteres necessário
        </p>
      )}

      {showWarning && (
        <Alert variant="warning" className="mt-4" role="alert">
          <AlertDescription>
            <strong>Atenção:</strong> Detectamos possíveis dados pessoais no texto.
            Por segurança, evite incluir CPF, CNPJ, números de cartão, emails ou
            outras informações pessoais.
          </AlertDescription>
        </Alert>
      )}

      {dadosPessoaisDetectados.possui && (
        <Alert variant="warning" className="mt-4" role="alert">
          <AlertDescription>
            <strong>Atenção:</strong> Detectamos dados pessoais no texto:{' '}
            {dadosPessoaisDetectados.tipos.join(', ')}.
            {report.identification.type === 'anonymous' && (
              <> Considere remover essas informações ou registrar como identificada.</>
            )}
          </AlertDescription>
        </Alert>
      )}

      <p id="text-input-description" className="mt-2 text-xs text-muted-foreground" role="note">
        Evite CPF, cartão de crédito, senhas ou outros dados sensíveis.
      </p>

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
          const textoLimpo = removerDadosPessoais(
            report.description,
            dadosPessoaisDetectados.tipos
          );
          updateDescription(textoLimpo);
          setShowPersonalDataAlert(false);
          setDadosPessoaisDetectados({ possui: false, tipos: [] });
        }}
        onCancelar={() => setShowPersonalDataAlert(false)}
      />
    </div>
  );
};
