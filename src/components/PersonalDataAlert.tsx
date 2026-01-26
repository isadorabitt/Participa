import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { type TipoDadoPessoal } from '../utils/detectarDadosPessoais';

interface PersonalDataAlertProps {
  open: boolean;
  tiposEncontrados: TipoDadoPessoal[];
  onConfirmarIdentificado: () => void;
  onRemoverDados: () => void;
  onCancelar: () => void;
}

export const PersonalDataAlert = ({
  open,
  tiposEncontrados,
  onConfirmarIdentificado,
  onRemoverDados,
  onCancelar,
}: PersonalDataAlertProps) => {
  const getColorForType = (tipo: TipoDadoPessoal) => {
    switch (tipo) {
      case 'CPF':
      case 'RG':
        return 'error';
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

  return (
    <Dialog
      open={open}
      onClose={onCancelar}
      maxWidth="sm"
      fullWidth
      aria-labelledby="personal-data-alert-title"
      aria-describedby="personal-data-alert-description"
    >
      <DialogTitle
        id="personal-data-alert-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          paddingBottom: 1,
        }}
      >
        <WarningIcon color="warning" sx={{ fontSize: 28 }} />
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Dados Pessoais Detectados
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ marginBottom: 3 }} role="alert">
          <Typography variant="body2" id="personal-data-alert-description">
            <strong>Atenção:</strong> Sua manifestação contém dados pessoais sensíveis. 
            Por segurança e conformidade com a LGPD, você tem duas opções:
          </Typography>
        </Alert>

        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Dados detectados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tiposEncontrados.map((tipo) => (
              <Chip
                key={tipo}
                label={tipo}
                color={getColorForType(tipo)}
                size="small"
                sx={{ fontWeight: 500 }}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: '#F4F5F7',
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Opções disponíveis:
          </Typography>
          <List dense sx={{ padding: 0 }}>
            <ListItem sx={{ paddingX: 0, paddingY: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Seguir como identificada
                  </Typography>
                }
                secondary="Seus dados serão salvos e você poderá acompanhar o registro"
              />
            </ListItem>
            <ListItem sx={{ paddingX: 0, paddingY: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Remover dados pessoais
                  </Typography>
                }
                secondary="Os dados serão removidos e substituídos por [DADO REMOVIDO]"
              />
            </ListItem>
          </List>
        </Box>

        <Alert severity="info" sx={{ marginTop: 2 }}>
          <Typography variant="caption">
            <strong>Importante:</strong> Dados pessoais em manifestações anônimas podem 
            comprometer sua privacidade. Recomendamos remover ou registrar como identificada.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ padding: 2, paddingTop: 1 }}>
        <Button
          onClick={onCancelar}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onRemoverDados}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ minWidth: 140 }}
        >
          Remover Dados
        </Button>
        <Button
          onClick={onConfirmarIdentificado}
          variant="contained"
          color="primary"
          startIcon={<PersonIcon />}
          sx={{ minWidth: 180 }}
        >
          Seguir como Identificada
        </Button>
      </DialogActions>
    </Dialog>
  );
};

