import { useAccessibility } from '@/context/AccessibilityContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export function HighContrastToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Switch
          id="high-contrast"
          checked={highContrast}
          onCheckedChange={toggleHighContrast}
          aria-label="Alternar alto contraste"
          aria-describedby="high-contrast-description"
        />
        <Label htmlFor="high-contrast" className="text-sm font-medium cursor-pointer">
          Alto Contraste
        </Label>
      </div>
      <p id="high-contrast-description" className="text-xs text-muted-foreground">
        Aumenta o contraste entre texto e fundo para melhorar a legibilidade. Atalho: Alt + C
      </p>
    </div>
  );
}
