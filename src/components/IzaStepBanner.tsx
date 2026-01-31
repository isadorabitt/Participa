import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, FileText } from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import { DESCRIPTION_TEMPLATE } from '@/constants/formTemplates';
import type { IzaContextId } from './FieldTutorial';
import { cn } from '@/lib/utils';

const STEP_TIPS: { contextId: IzaContextId; tip: string; showExample?: boolean }[] = [
  {
    contextId: 'novo-registro-descricao',
    tip: 'Descreva o fato com detalhes. Use o modelo abaixo para não esquecer data, local e envolvidos.',
    showExample: true,
  },
  {
    contextId: 'novo-registro-localizacao',
    tip: 'Informar onde ocorreu ajuda a direcionar sua manifestação. É opcional.',
  },
  {
    contextId: 'novo-registro-identificacao',
    tip: 'Escolha anônimo ou identificado. Em ambos você recebe protocolo para acompanhar.',
  },
  {
    contextId: 'novo-registro-resumo',
    tip: 'Confira tudo e clique em Finalizar. Você receberá um protocolo por e-mail ou na tela.',
  },
];

interface IzaStepBannerProps {
  stepIndex: number;
  /** Versão compacta para barra fixa inferior */
  variant?: 'default' | 'compact';
}

export function IzaStepBanner({ stepIndex, variant = 'default' }: IzaStepBannerProps) {
  const { updateDescription } = useReport();
  const step = STEP_TIPS[stepIndex];
  if (!step) return null;

  const openIzaWithContext = () => {
    globalThis.dispatchEvent(
      new CustomEvent('open-iza-with-context', { detail: { contextId: step.contextId } })
    );
  };

  const insertExample = () => {
    updateDescription(DESCRIPTION_TEMPLATE);
  };

  const isCompact = variant === 'compact';

  return (
    <aside
      aria-label="Assistente IZA para preenchimento"
      className={cn(
        'flex flex-col rounded-xl border border-participa-pink/30 bg-gradient-to-br from-participa-pink/10 via-participa-pink/5 to-transparent shadow-sm sm:flex-row sm:items-center',
        isCompact
          ? 'gap-2 border border-participa-pink/25 px-3 py-2 shadow-sm sm:gap-3 sm:px-4 sm:py-2'
          : 'mb-6 gap-3 p-4 sm:gap-5 sm:px-5'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-participa-pink to-participa-pink-dark text-white shadow-md',
            isCompact ? 'h-7 w-7' : 'h-11 w-11'
          )}
        >
          <Sparkles className={isCompact ? 'h-3.5 w-3.5' : 'h-5 w-5'} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'font-semibold uppercase tracking-wider text-participa-pink',
              isCompact ? 'text-[10px] leading-tight' : 'text-xs'
            )}
          >
            IZA – IA para preenchimento
          </p>
          <p
            className={cn(
              'font-medium text-foreground',
              isCompact ? 'truncate text-[11px] leading-tight' : 'text-sm'
            )}
          >
            {step.tip}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:ml-auto sm:gap-2">
        {step.showExample && (
          <Button
            type="button"
            size={isCompact ? 'sm' : 'sm'}
            variant="outline"
            onClick={insertExample}
            className={cn(
              'gap-1.5 rounded-lg border-participa-pink/50 bg-white font-medium text-participa-pink hover:bg-participa-pink/10 hover:text-participa-pink-dark',
              isCompact && 'h-8 px-2.5 text-xs'
            )}
            aria-label="Inserir modelo de descrição sugerido pela IZA"
          >
            <FileText className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
            {isCompact ? 'Ver exemplo' : 'Ver exemplo de descrição'}
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={openIzaWithContext}
          className={cn(
            'gap-1.5 rounded-lg bg-participa-pink font-medium text-white shadow-sm hover:bg-participa-pink-dark',
            isCompact && 'h-8 px-3 text-xs'
          )}
          aria-label="Abrir chat da IZA para ajuda neste passo"
        >
          <MessageCircle className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
          Falar com a IZA
        </Button>
      </div>
    </aside>
  );
}
