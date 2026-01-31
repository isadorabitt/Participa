import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepClick,
  orientation = 'vertical',
  className,
}: StepperProps) {
  return (
    <nav
      aria-label="Progresso do formulário"
      className={cn(
        orientation === 'vertical' && 'relative flex flex-col',
        orientation === 'horizontal' && 'w-full',
        className
      )}
    >
      {orientation === 'horizontal' ? (
        <div className="w-full">
          {/* Números em cima – cada um centralizado na sua coluna */}
          <div className="flex items-center">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isCurrent = index === activeStep;
              const isClickable = onStepClick && index <= activeStep;

              return (
                <div
                  key={`circle-${step.label}`}
                  className="flex min-w-0 flex-1 items-center justify-center"
                >
                  {/* Espaço à esquerda (conector ou vazio) – flex-1 para centralizar o círculo */}
                  <div
                    className={cn(
                      'h-0.5 flex-1 shrink-0 transition-colors duration-200',
                      index > 0 && (index <= activeStep ? 'bg-participa-blue' : 'bg-border')
                    )}
                    aria-hidden
                  />
                  <div className="flex shrink-0 justify-center">
                    <button
                      type="button"
                      onClick={() => isClickable && onStepClick(index)}
                      disabled={!isClickable}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`${step.label}${isCompleted ? ', concluído' : ''}`}
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2',
                        isCompleted &&
                          'border-participa-blue bg-participa-blue text-white',
                        isCurrent &&
                          'border-participa-blue bg-participa-blue text-white shadow-md shadow-participa-blue/25 ring-2 ring-participa-blue/30 ring-offset-2',
                        !isCompleted &&
                          !isCurrent &&
                          'border-border bg-muted/50 text-muted-foreground',
                        isClickable &&
                          !isCurrent &&
                          'cursor-pointer hover:border-participa-blue/60 hover:bg-participa-blue/5 hover:text-participa-blue',
                        !isClickable && 'cursor-default'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" aria-hidden />
                      ) : (
                        index + 1
                      )}
                    </button>
                  </div>
                  {/* Espaço à direita (conector ou vazio) – flex-1 para centralizar o círculo */}
                  <div
                    className={cn(
                      'h-0.5 flex-1 shrink-0 transition-colors duration-200',
                      index < steps.length - 1 && (index < activeStep ? 'bg-participa-blue' : 'bg-border')
                    )}
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
          {/* Títulos e descrições embaixo */}
          <div className="mt-3 flex items-start">
            {steps.map((step, index) => {
              const isCurrent = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div
                  key={`label-${step.label}`}
                  className="flex min-w-0 flex-1 flex-col items-center px-1 text-center"
                >
                  <span
                    className={cn(
                      'block text-sm font-medium transition-colors',
                      isCurrent && 'text-participa-blue',
                      isCompleted && 'text-foreground',
                      !isCurrent && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-2">
                      {step.description}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;
          const isClickable = onStepClick && index <= activeStep;

          return (
            <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.label}${isCompleted ? ', concluído' : ''}`}
                className={cn(
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isCompleted &&
                    'border-participa-blue bg-participa-blue text-white',
                  isCurrent &&
                    'border-participa-blue bg-background text-participa-blue',
                  !isCompleted &&
                    !isCurrent &&
                    'border-muted-foreground/30 bg-background text-muted-foreground',
                  isClickable && 'cursor-pointer hover:border-participa-blue/80',
                  !isClickable && 'cursor-default'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" aria-hidden />
                ) : (
                  index + 1
                )}
              </button>
              <div className="flex flex-1 flex-col">
                <span
                  className={cn(
                    'block text-sm font-semibold',
                    isCurrent && 'text-participa-blue',
                    isCompleted && 'text-foreground',
                    !isCurrent && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className="absolute left-5 top-10 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-border"
                  aria-hidden
                />
              )}
            </div>
          );
        })
      )}
    </nav>
  );
}
