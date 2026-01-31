import type { ReactNode } from 'react';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProtocolDisplayVariant = 'block' | 'inline' | 'compact';

interface ProtocolDisplayProps {
  protocol: string;
  variant?: ProtocolDisplayVariant;
  showCopy?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  /** Ações extras (ex.: botão Imprimir) exibidas ao lado do copiar no variant block */
  actions?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const baseClasses = 'font-mono font-semibold text-primary tracking-tight';

export function ProtocolDisplay({
  protocol,
  variant = 'block',
  showCopy = true,
  onCopy,
  copied = false,
  actions,
  className,
  'aria-label': ariaLabel,
}: ProtocolDisplayProps) {
  const label = ariaLabel ?? `Protocolo: ${protocol}`;

  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-block rounded-md bg-muted px-2.5 py-1.5 text-sm',
          baseClasses,
          className
        )}
        aria-label={label}
      >
        {protocol}
      </span>
    );
  }

  const hasActions =
    (showCopy && onCopy) || actions;

  return (
    <div className={cn('flex flex-col gap-4', className)} aria-label={label}>
      <div className="min-w-0">
        {variant === 'block' ? (
          <p
            className={cn(
              baseClasses,
              'rounded-xl border border-border bg-primary/5 px-5 py-4 text-center text-xl break-all md:text-2xl'
            )}
          >
            {protocol}
          </p>
        ) : (
          <span
            className={cn(
              'inline-block rounded-lg border border-border bg-muted px-3 py-2 text-sm md:text-base',
              baseClasses
            )}
          >
            {protocol}
          </span>
        )}
      </div>
      {hasActions && (
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4">
          {showCopy && onCopy && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopy}
                aria-label="Copiar protocolo"
                className="h-10 w-10 shrink-0 bg-muted hover:bg-muted/80"
              >
                <Copy className="h-5 w-5 text-primary" />
              </Button>
              {copied && (
                <span className="text-sm text-muted-foreground" role="status">
                  Copiado!
                </span>
              )}
            </>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
