import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

export function FontSizeControl() {
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  } = useAccessibility();

  const canIncrease = fontSize < MAX_FONT_SIZE;
  const canDecrease = fontSize > MIN_FONT_SIZE;
  const isDefault = fontSize === DEFAULT_FONT_SIZE;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tamanho da Fonte</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decreaseFontSize}
          disabled={!canDecrease}
          aria-label="Diminuir tamanho da fonte"
          title="Diminuir fonte (Alt + -)"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span
          className="min-w-[60px] text-center text-sm font-bold"
          aria-live="polite"
          aria-atomic="true"
        >
          {fontSize}px
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increaseFontSize}
          disabled={!canIncrease}
          aria-label="Aumentar tamanho da fonte"
          title="Aumentar fonte (Alt + +)"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={resetFontSize}
          disabled={isDefault}
          aria-label="Resetar tamanho da fonte para padrão"
          title="Resetar para tamanho padrão (Alt + 0)"
          className="ml-1"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <p id="font-size-description" className="text-xs text-muted-foreground">
        Ajuste o tamanho da fonte para melhorar a legibilidade
      </p>
    </div>
  );
}
