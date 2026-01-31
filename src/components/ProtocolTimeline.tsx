import { Send, Search, Forward, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: 'enviado',
    title: 'Registro Enviado',
    description: 'Seu registro foi recebido e está no sistema',
    icon: <Send className="h-6 w-6 md:h-8 md:w-8" />,
    color: '#005FDB',
    gradient: 'linear-gradient(135deg, #005FDB 0%, #0048A8 100%)',
  },
  {
    id: 'analise',
    title: 'Em Análise',
    description: 'Nossa equipe está analisando sua manifestação',
    icon: <Search className="h-6 w-6 md:h-8 md:w-8" />,
    color: '#FFC107',
    gradient: 'linear-gradient(135deg, #FFC107 0%, #F57C00 100%)',
  },
  {
    id: 'encaminhado',
    title: 'Encaminhado',
    description: 'O registro foi encaminhado para o setor responsável',
    icon: <Forward className="h-6 w-6 md:h-8 md:w-8" />,
    color: '#E1007A',
    gradient: 'linear-gradient(135deg, #E1007A 0%, #B80062 100%)',
  },
  {
    id: 'respondido',
    title: 'Respondido',
    description: 'Sua manifestação foi respondida e finalizada',
    icon: <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8" />,
    color: '#2E7D32',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  },
];

export const ProtocolTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [animatedSteps, setAnimatedSteps] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < timelineSteps.length - 1) {
          const next = prev + 1;
          setAnimatedSteps((s) => new Set([...s, next]));
          return next;
        }
        return prev;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <h2 className="mb-6 text-center text-lg font-semibold text-foreground md:mb-8 md:text-xl">
        Acompanhamento do Protocolo
      </h2>

      <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:relative md:px-2">
        <div
          className="absolute left-[12%] right-[12%] top-14 h-0.5 rounded-full transition-all"
          style={{ background: 'linear-gradient(90deg, #005FDB 0%, #FFC107 50%, #E1007A 75%, #2E7D32 100%)' }}
          aria-hidden
        />
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeStep;
          const isAnimated = animatedSteps.has(index);
          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 md:h-24 md:w-24"
                style={{
                  background: isActive ? step.gradient : '#E8E9EB',
                  color: isActive ? '#fff' : '#8B9099',
                  transform: isAnimated ? 'scale(1.1)' : isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {step.icon}
              </div>
              <div
                className="mt-4 w-full min-h-[3.5rem] text-center transition-opacity duration-300 md:mt-5 md:min-h-[4rem]"
                style={{ opacity: isActive ? 1 : 0.5 }}
              >
                <p className="mb-1 text-sm font-semibold md:text-base" style={{ color: isActive ? '#1A1A1A' : '#8B9099' }}>
                  {step.title}
                </p>
                <p className="text-xs leading-snug text-muted-foreground md:text-sm md:leading-relaxed" style={{ color: isActive ? '#4A4A4A' : '#8B9099' }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 px-4 md:hidden">
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeStep;
          const isAnimated = animatedSteps.has(index);
          return (
            <div key={step.id} className="relative flex gap-4 pl-8">
              {index < timelineSteps.length - 1 && (
                <div
                  className="absolute left-[23px] top-[60px] bottom-[-24px] w-1 rounded-full transition-colors"
                  style={{
                    background: isActive
                      ? `linear-gradient(180deg, ${step.color} 0%, ${timelineSteps[index + 1].color} 100%)`
                      : '#E8E9EB',
                  }}
                  aria-hidden
                />
              )}
              <div
                className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all duration-300"
                style={{
                  background: isActive ? step.gradient : '#E8E9EB',
                  color: isActive ? '#fff' : '#8B9099',
                  transform: isAnimated ? 'scale(1.15)' : isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {step.icon}
              </div>
              <div className="flex-1 pt-1" style={{ opacity: isActive ? 1 : 0.5 }}>
                <p className="text-base font-semibold" style={{ color: isActive ? '#1A1A1A' : '#8B9099' }}>
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isActive ? '#4A4A4A' : '#8B9099' }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
