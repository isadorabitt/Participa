import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { useReport } from '../context/ReportContext';
import { Attachments } from '../components/Attachments';
import { LocationStep } from '../components/LocationStep';
import { Identification } from '../components/Identification';
import { Summary } from '../components/Summary';
import { Protocol } from '../components/Protocol';

const steps = [
  {
    label: 'Descrição e Anexos',
    description: 'Forneça uma descrição detalhada e adicione anexos se necessário',
    component: <Attachments />,
  },
  {
    label: 'Localização',
    description: 'Informe a localização do registro (opcional)',
    component: <LocationStep />,
  },
  {
    label: 'Identificação',
    description: 'Escolha se deseja fazer o registro anônimo ou identificado',
    component: <Identification />,
  },
  {
    label: 'Resumo',
    description: 'Revise todas as informações antes de finalizar',
    component: <Summary />,
  },
  {
    label: 'Protocolo',
    description: 'Seu registro foi enviado com sucesso',
    component: <Protocol />,
  },
];

export const NewReport = () => {
  const { report, generateSummary, generateProtocol } = useReport();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Validar descrição antes de avançar
  const validateStep = (step: number): boolean => {
    if (step === 0) {
      const description = report.description?.trim() || '';
      if (!description) {
        setErrors((prev) => ({
          ...prev,
          0: 'A descrição é obrigatória.',
        }));
        return false;
      }
      if (description.length < 10) {
        setErrors((prev) => ({
          ...prev,
          0: 'A descrição deve ter no mínimo 10 caracteres.',
        }));
        return false;
      }
      if (description.length > 5000) {
        setErrors((prev) => ({
          ...prev,
          0: 'A descrição não pode exceder 5000 caracteres.',
        }));
        return false;
      }
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[0];
        return newErrors;
      });
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 2) {
        // Antes de ir para resumo, gerar resumo
        generateSummary();
      }
      if (activeStep === 3) {
        // Antes de ir para protocolo, gerar protocolo
        generateProtocol();
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
    } else if (step === activeStep + 1 && validateStep(activeStep)) {
      setActiveStep(step);
    }
  };

  // Se estiver no último passo (Protocolo), não mostrar o stepper
  if (activeStep === steps.length - 1) {
    return (
      <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
        <Protocol />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: 3,
        }}
      >
        Novo Registro
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#4A4A4A',
          fontSize: '1.125rem',
          lineHeight: 1.6,
          marginBottom: 4,
          maxWidth: '800px',
        }}
        paragraph
      >
        Preencha os dados abaixo para criar um novo registro. Você pode navegar entre as etapas
        usando o menu lateral ou os botões de navegação.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          padding: { xs: 2.5, sm: 4, md: 5 },
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E9EB',
          borderRadius: { xs: 2.5, sm: 3 },
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.slice(0, -1).map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                onClick={() => handleStep(index)}
                sx={{
                  cursor: index <= activeStep ? 'pointer' : 'default',
                  '& .MuiStepLabel-label': {
                    fontSize: 'inherit',
                  },
                }}
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                {errors[index] && (
                  <Alert severity="error" sx={{ marginBottom: 2 }} role="alert">
                    {errors[index]}
                  </Alert>
                )}

                <Box sx={{ marginBottom: 3 }}>{step.component}</Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    aria-label={`Voltar para etapa ${index}`}
                    sx={{ minWidth: { xs: 'calc(50% - 8px)', sm: 'auto' } }}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    aria-label={
                      index === steps.length - 2
                        ? 'Finalizar registro'
                        : `Avançar para etapa ${index + 2}`
                    }
                    sx={{ minWidth: { xs: 'calc(50% - 8px)', sm: 'auto' } }}
                  >
                    {index === steps.length - 2 ? 'Finalizar' : 'Próximo'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

