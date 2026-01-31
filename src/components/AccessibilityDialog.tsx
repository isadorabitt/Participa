import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HighContrastToggle } from './HighContrastToggle';
import { FontSizeControl } from './FontSizeControl';
import { ColorBlindModeSelector } from './ColorBlindModeSelector';
import { EasyReadingToggle } from './EasyReadingToggle';
import { TextOnlyToggle } from './TextOnlyToggle';
import { Separator } from '@/components/ui/separator';

interface AccessibilityDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AccessibilityDialog({ open, onClose }: AccessibilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm sm:max-w-md"
        showClose={true}
        aria-labelledby="accessibility-dialog-title"
        aria-describedby="accessibility-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="accessibility-dialog-title">
            Configurações de Acessibilidade
          </DialogTitle>
          <DialogDescription id="accessibility-dialog-description">
            Personalize as configurações de acessibilidade para melhorar sua
            experiência de uso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <HighContrastToggle />
          <Separator />
          <FontSizeControl />
          <Separator />
          <ColorBlindModeSelector />
          <Separator />
          <EasyReadingToggle />
          <Separator />
          <TextOnlyToggle />

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-semibold">Atalhos de Teclado:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><strong>Alt + C</strong> – Alternar alto contraste</li>
              <li><strong>Alt + +</strong> – Aumentar fonte</li>
              <li><strong>Alt + -</strong> – Diminuir fonte</li>
              <li><strong>Alt + 0</strong> – Resetar fonte</li>
              <li><strong>Alt + N</strong> – Novo Registro</li>
              <li><strong>Alt + I</strong> – Início</li>
              <li><strong>Alt + A</strong> – Acessibilidade</li>
              <li><strong>Alt + M</strong> – Menu (mobile)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
