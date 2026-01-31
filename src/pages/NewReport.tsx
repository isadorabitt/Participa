import { useState } from 'react';
import { useReport } from '@/context/ReportContext';
import { Attachments } from '@/components/Attachments';
import { LocationStep } from '@/components/LocationStep';
import { Identification } from '@/components/Identification';
import { Summary } from '@/components/Summary';
import { Protocol } from '@/components/Protocol';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IzaStepBanner } from '@/components/IzaStepBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    label: 'Descrição e Anexos',
    description: 'Descreva o fato e, se quiser, adicione áudio, imagem ou vídeo',
    component: <Attachments />,
    instruction:
      'Descreva com clareza o que aconteceu (data, local, envolvidos). A descrição é obrigatória. Áudio, imagem e vídeo são opcionais.',
  },
  {
    label: 'Localização',
    description: 'Informe a localização do registro (opcional)',
    component: <LocationStep />,
    instruction:
      'Informe a localização do fato ou do serviço relacionado à sua manifestação, se desejar.',
  },
  {
    label: 'Identificação',
    description: 'Escolha se deseja fazer o registro anônimo ou identificado',
    component: <Identification />,
    instruction:
      'Escolha se deseja fazer o registro de forma anônima ou identificada.',
  },
  {
    label: 'Resumo',
    description: 'Revise todas as informações antes de finalizar',
    component: <Summary />,
    instruction: 'Revise todas as informações antes de finalizar o envio.',
  },
  {
    label: 'Protocolo',
    description: 'Seu registro foi enviado com sucesso',
    component: <Protocol />,
    instruction: '',
  },
];

export function NewReport() {
  const { report, generateSummary, generateProtocol } = useReport();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      const description = report.description?.trim() || '';
      if (!description) {
        setErrors((prev) => ({ ...prev, 0: 'A descrição é obrigatória.' }));
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
        const next = { ...prev };
        delete next[0];
        return next;
      });
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 2) generateSummary();
      if (activeStep === 3) generateProtocol();
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleStepClick = (step: number) => {
    if (step < activeStep) setActiveStep(step);
    else if (step === activeStep + 1 && validateStep(activeStep))
      setActiveStep(step);
  };

  if (activeStep === steps.length - 1) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <Protocol />
          </CardContent>
        </Card>
      </div>
    );
  }

  const displaySteps = steps.slice(0, -1);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full min-w-0 py-6">
      <div className="w-full px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Nova Manifestação
        </h1>

        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <Stepper
              steps={displaySteps.map((s) => ({
                label: s.label,
                description: s.description,
              }))}
              activeStep={activeStep}
              onStepClick={handleStepClick}
              orientation="horizontal"
            />
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="mb-4 text-sm font-medium text-participa-blue">
            Passo {activeStep + 1} de {displaySteps.length} – {displaySteps[activeStep]?.label}
          </p>

          {errors[activeStep] && (
            <Alert variant="destructive" className="mb-4 rounded-xl" role="alert">
              <AlertDescription>{errors[activeStep]}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="p-6 sm:p-8">
              {displaySteps[activeStep]?.component}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={activeStep === 0}
            aria-label={`Voltar para etapa ${activeStep}`}
            className="gap-1.5 text-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            aria-label={
              activeStep === displaySteps.length - 1
                ? 'Finalizar registro'
                : `Avançar para etapa ${activeStep + 2}`
            }
            className="gap-1.5 rounded-xl bg-participa-blue font-medium text-white shadow-sm transition-all hover:bg-participa-blue-dark hover:shadow-glow-sm"
          >
            {activeStep === displaySteps.length - 1 ? 'Finalizar' : 'Avançar'}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <p className="mt-6 text-center">
          <Button variant="link" size="sm" className="text-participa-blue" asChild>
            <a href="https://participa.df.gov.br" target="_blank" rel="noopener noreferrer">
              participa.df.gov.br
            </a>
          </Button>
        </p>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2 sm:px-4 sm:py-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        aria-label="Assistente IZA fixo"
      >
        <div className="mx-auto max-w-4xl bg-white rounded-xl">
          <IzaStepBanner stepIndex={activeStep} variant="compact" />
        </div>
      </div>
    </div>
  );
}
