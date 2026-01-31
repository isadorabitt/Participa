import { useAccessibility, type ColorBlindMode } from '@/context/AccessibilityContext';
import { cn } from '@/lib/utils';

const options: { value: ColorBlindMode; label: string; ariaLabel: string }[] = [
  { value: 'none', label: 'Nenhum (Normal)', ariaLabel: 'Sem filtro de daltonismo' },
  {
    value: 'protanopia',
    label: 'Protanopia (Ausência de cones vermelhos)',
    ariaLabel: 'Filtro para protanopia',
  },
  {
    value: 'deuteranopia',
    label: 'Deuteranopia (Ausência de cones verdes)',
    ariaLabel: 'Filtro para deuteranopia',
  },
  {
    value: 'tritanopia',
    label: 'Tritanopia (Ausência de cones azuis)',
    ariaLabel: 'Filtro para tritanopia',
  },
];

export function ColorBlindModeSelector() {
  const { colorBlindMode, setColorBlindMode } = useAccessibility();

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold">Modo Daltônico</legend>
      <p className="text-xs text-muted-foreground">
        Aplique filtros de correção de cor para diferentes tipos de daltonismo.
      </p>
      <div
        className="space-y-2"
        role="radiogroup"
        aria-label="Modo daltônico"
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/50',
              colorBlindMode === opt.value && 'border-participa-blue bg-participa-blue/5'
            )}
          >
            <input
              type="radio"
              name="colorblind"
              value={opt.value}
              checked={colorBlindMode === opt.value}
              onChange={(e) => setColorBlindMode(e.target.value as ColorBlindMode)}
              aria-label={opt.ariaLabel}
              className="h-4 w-4 border-input text-participa-blue focus:ring-participa-blue"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
