import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { useAccessibility } from '../context/AccessibilityContext';

export const EasyReadingToggle = () => {
  const { easyReading, toggleEasyReading } = useAccessibility();

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={easyReading}
            onChange={toggleEasyReading}
            aria-label="Modo leitura fácil"
          />
        }
        label={
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Modo Leitura Fácil
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aumenta espaçamento, fontes maiores e remove elementos complexos para facilitar a leitura.
            </Typography>
          </Box>
        }
        sx={{ margin: 0, alignItems: 'flex-start' }}
      />
    </Box>
  );
};

