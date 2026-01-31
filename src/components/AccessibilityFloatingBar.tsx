import { Eye, Volume2, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibilityFloatingBarProps {
  onAccessibilityClick?: () => void;
  className?: string;
}

export function AccessibilityFloatingBar({
  onAccessibilityClick,
  className,
}: AccessibilityFloatingBarProps) {
  return (
    <aside
      className={cn(
        'fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2',
        'bottom-auto hidden lg:flex',
        className
      )}
      aria-label="Atalhos de acessibilidade"
    >
      <Button
        variant="default"
        size="icon"
        onClick={onAccessibilityClick}
        aria-label="Alto contraste / Ajustes visuais"
        className="h-12 w-12 rounded-xl bg-participa-blue shadow-lg hover:bg-participa-blue-dark"
      >
        <Eye className="h-5 w-5 text-white" />
      </Button>
      <Button
        variant="default"
        size="icon"
        aria-label="Leitura em voz alta"
        className="h-12 w-12 rounded-xl bg-participa-blue shadow-lg hover:bg-participa-blue-dark"
      >
        <Volume2 className="h-5 w-5 text-white" />
      </Button>
      <Button
        variant="default"
        size="icon"
        aria-label="Modo acessível"
        className="h-12 w-12 rounded-xl bg-participa-blue shadow-lg hover:bg-participa-blue-dark"
      >
        <Hand className="h-5 w-5 text-white" />
      </Button>
    </aside>
  );
}
