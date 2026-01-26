import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { HighContrastToggle } from './HighContrastToggle';
import { FontSizeControl } from './FontSizeControl';
import { ColorBlindModeSelector } from './ColorBlindModeSelector';
import { EasyReadingToggle } from './EasyReadingToggle';
import { TextOnlyToggle } from './TextOnlyToggle';

interface AccessibilityDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AccessibilityDialog = ({ open, onClose }: AccessibilityDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="accessibility-dialog-title"
      aria-describedby="accessibility-dialog-description"
    >
      <DialogTitle id="accessibility-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="span">
            Configurações de Acessibilidade
          </Typography>
          <Button
            onClick={onClose}
            aria-label="Fechar diálogo de acessibilidade"
            sx={{ minWidth: 'auto', padding: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography
          id="accessibility-dialog-description"
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 3 }}
        >
          Personalize as configurações de acessibilidade para melhorar sua experiência de uso.
        </Typography>

        <HighContrastToggle />
        <Divider sx={{ marginY: 2 }} />
        <FontSizeControl />
        <Divider sx={{ marginY: 2 }} />
        <ColorBlindModeSelector />
        <Divider sx={{ marginY: 2 }} />
        <EasyReadingToggle />
        <Divider sx={{ marginY: 2 }} />
        <TextOnlyToggle />

        <Box sx={{ marginTop: 3, padding: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Atalhos de Teclado:
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + C</Box> - Alternar alto contraste
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + +</Box> - Aumentar fonte
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + -</Box> - Diminuir fonte
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + 0</Box> - Resetar fonte
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + N</Box> - Novo Registro
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + I</Box> - Início
          </Typography>
          <Typography variant="body2" component="div" sx={{ marginBottom: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + A</Box> - Acessibilidade
          </Typography>
          <Typography variant="body2" component="div">
            <Box component="span" sx={{ fontWeight: 'bold' }}>Alt + M</Box> - Menu (mobile)
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

