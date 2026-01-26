import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { useAccessibility } from '../context/AccessibilityContext';

export const TextOnlyToggle = () => {
  const { textOnly, toggleTextOnly } = useAccessibility();

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={textOnly}
            onChange={toggleTextOnly}
            aria-label="Modo somente texto"
          />
        }
        label={
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Modo Somente Texto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Remove imagens, ícones e animações, exibindo apenas texto para melhor compatibilidade com leitores de tela.
            </Typography>
          </Box>
        }
        sx={{ margin: 0, alignItems: 'flex-start' }}
      />
    </Box>
  );
};

