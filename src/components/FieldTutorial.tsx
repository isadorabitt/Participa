import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const IZA_CONTEXT_EVENT = 'open-iza-with-context';

export type IzaContextId =
  | 'novo-registro-descricao'
  | 'novo-registro-anexos'
  | 'novo-registro-localizacao'
  | 'novo-registro-identificacao'
  | 'novo-registro-resumo';

interface FieldTutorialProps {
  /** Título curto do campo (ex.: "Descrição da manifestação") */
  title: string;
  /** Explicação do que o campo faz e como preencher */
  description: string;
  /** Identificador para a IZA dar uma resposta contextual ao abrir */
  izaContextId: IzaContextId;
  /** Classe no trigger (ícone) */
  className?: string;
  /** Tamanho do ícone */
  iconSize?: 'sm' | 'md';
}

export function FieldTutorial({
  title,
  description,
  izaContextId,
  className,
  iconSize = 'sm',
}: FieldTutorialProps) {
  const [open, setOpen] = useState(false);

  const askIza = () => {
    setOpen(false);
    globalThis.dispatchEvent(
      new CustomEvent(IZA_CONTEXT_EVENT, { detail: { contextId: izaContextId } })
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2"
      >
        <button
          type="button"
          aria-label={`Dica: ${title}. Clique para ver explicação ou perguntar à IZA.`}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-participa-blue',
            iconSize === 'sm' && 'h-6 w-6',
            iconSize === 'md' && 'h-8 w-8',
            className
          )}
        >
          <HelpCircle className={iconSize === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[280px] max-w-[320px] p-0">
        <div className="p-4">
          <h3 className="mb-1.5 text-sm font-semibold text-foreground">{title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={askIza}
            className="w-full gap-2 rounded-lg border-participa-blue/50 text-participa-blue hover:bg-participa-blue/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Perguntar à IZA
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
