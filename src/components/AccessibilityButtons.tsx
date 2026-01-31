import { Link } from 'react-router-dom';
import { Accessibility, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config';
import { cn } from '@/lib/utils';

interface AccessibilityButtonsProps {
  variant?: 'header' | 'footer';
  className?: string;
}

/**
 * Botões de Acessibilidade (página de recursos) e Libras (VLibras).
 * VLibras é carregado via script no index.html; o botão aciona o widget flutuante.
 */
export function AccessibilityButtons({ variant = 'header', className }: AccessibilityButtonsProps) {
  const openLibras = () => {
    const btn = document.querySelector('[vw-access-button]') as HTMLElement | null;
    if (btn) btn.click();
    else {
      const enabled = document.querySelector('div[vw].enabled') as HTMLElement | null;
      if (enabled) enabled.querySelector('[vw-access-button]')?.dispatchEvent(new MouseEvent('click'));
    }
  };

  const isFooter = variant === 'footer';

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="group"
      aria-label="Acessibilidade e Libras"
    >
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
          'gap-1.5',
          isFooter
            ? 'h-8 text-white hover:bg-white/10 hover:text-white'
            : 'h-7 text-white hover:bg-white/10 hover:text-white'
        )}
        aria-label="Acessibilidade - recursos e informações"
      >
        <Link to={ROUTES.ACCESSIBILITY}>
          <Accessibility className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Acessibilidade</span>
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={openLibras}
        className={cn(
          'gap-1.5',
          isFooter
            ? 'h-8 text-white hover:bg-white/10 hover:text-white'
            : 'h-7 text-white hover:bg-white/10 hover:text-white'
        )}
        aria-label="Abrir tradutor para Libras (Língua Brasileira de Sinais)"
      >
        <Hand className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden sm:inline">Libras</span>
      </Button>
    </div>
  );
}
