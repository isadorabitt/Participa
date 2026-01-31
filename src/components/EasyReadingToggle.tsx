import { useAccessibility } from '@/context/AccessibilityContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function EasyReadingToggle() {
  const { easyReading, toggleEasyReading } = useAccessibility();

  return (
    <div className="flex items-start gap-3">
      <Switch
        id="easy-reading"
        checked={easyReading}
        onCheckedChange={toggleEasyReading}
        aria-label="Modo leitura fácil"
      />
      <div className="grid gap-1">
        <Label htmlFor="easy-reading" className="text-sm font-semibold cursor-pointer">
          Modo Leitura Fácil
        </Label>
        <p className="text-xs text-muted-foreground">
          Aumenta espaçamento, fontes maiores e remove elementos complexos para facilitar a leitura.
        </p>
      </div>
    </div>
  );
}
