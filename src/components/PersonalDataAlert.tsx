import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, User, Trash2 } from 'lucide-react';
import { type TipoDadoPessoal } from '../utils/detectarDadosPessoais';

interface PersonalDataAlertProps {
  open: boolean;
  tiposEncontrados: TipoDadoPessoal[];
  onConfirmarIdentificado: () => void;
  onRemoverDados: () => void;
  onCancelar: () => void;
}

const getBadgeVariant = (tipo: TipoDadoPessoal): 'destructive' | 'warning' | 'info' | 'default' => {
  switch (tipo) {
    case 'CPF':
    case 'RG':
      return 'destructive';
    case 'Telefone':
    case 'E-mail':
      return 'warning';
    case 'Nome Completo':
    case 'Endereço':
      return 'info';
    default:
      return 'default';
  }
};

export const PersonalDataAlert = ({
  open,
  tiposEncontrados,
  onConfirmarIdentificado,
  onRemoverDados,
  onCancelar,
}: PersonalDataAlertProps) => (
  <Dialog open={open} onOpenChange={(o) => !o && onCancelar()}>
    <DialogContent
      className="max-w-sm sm:max-w-lg"
      aria-labelledby="personal-data-alert-title"
      aria-describedby="personal-data-alert-description"
      showClose={false}
    >
      <DialogHeader>
        <DialogTitle
          id="personal-data-alert-title"
          className="flex items-center gap-2 pb-2"
        >
          <AlertTriangle className="h-7 w-7 text-amber-600" aria-hidden />
          Dados Pessoais Detectados
        </DialogTitle>
      </DialogHeader>

      <Alert variant="warning" className="mb-4" role="alert">
        <AlertDescription id="personal-data-alert-description">
          <strong>Atenção:</strong> Sua manifestação contém dados pessoais sensíveis.
          Por segurança e conformidade com a LGPD, você tem duas opções:
        </AlertDescription>
      </Alert>

      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold">Dados detectados:</p>
        <div className="flex flex-wrap gap-2">
          {tiposEncontrados.map((tipo) => (
            <Badge key={tipo} variant={getBadgeVariant(tipo)}>
              {tipo}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <p className="mb-2 text-sm font-semibold">Opções disponíveis:</p>
        <ul className="list-none space-y-2 p-0 text-sm">
          <li>
            <span className="font-medium">Seguir como identificada</span>
            <p className="text-muted-foreground">
              Seus dados serão salvos e você poderá acompanhar o registro
            </p>
          </li>
          <li>
            <span className="font-medium">Remover dados pessoais</span>
            <p className="text-muted-foreground">
              Os dados serão removidos e substituídos por [DADO REMOVIDO]
            </p>
          </li>
        </ul>
      </div>

      <Alert variant="info" className="mt-4">
        <AlertDescription className="text-xs">
          <strong>Importante:</strong> Dados pessoais em manifestações anônimas podem
          comprometer sua privacidade. Recomendamos remover ou registrar como identificada.
        </AlertDescription>
      </Alert>

      <DialogFooter className="flex flex-wrap gap-2 pt-4">
        <Button variant="outline" onClick={onCancelar} className="min-w-[100px]">
          Cancelar
        </Button>
        <Button
          variant="outline"
          className="min-w-[140px] border-destructive text-destructive hover:bg-destructive/10"
          onClick={onRemoverDados}
        >
          <Trash2 className="h-4 w-4" />
          Remover Dados
        </Button>
        <Button onClick={onConfirmarIdentificado} className="min-w-[180px]">
          <User className="h-4 w-4" />
          Seguir como Identificada
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
