import { useAccessibility } from '@/context/AccessibilityContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function TextOnlyToggle() {
  const { textOnly, toggleTextOnly } = useAccessibility();

  return (
    <div className="flex items-start gap-3">
      <Switch
        id="text-only"
        checked={textOnly}
        onCheckedChange={toggleTextOnly}
        aria-label="Modo somente texto"
      />
      <div className="grid gap-1">
        <Label htmlFor="text-only" className="text-sm font-semibold cursor-pointer">
          Modo Somente Texto
        </Label>
        <p className="text-xs text-muted-foreground">
          Remove imagens, ícones e animações, exibindo apenas texto para melhor compatibilidade com leitores de tela.
        </p>
      </div>
    </div>
  );
}
