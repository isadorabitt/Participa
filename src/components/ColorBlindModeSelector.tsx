import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useAccessibility, type ColorBlindMode } from '../context/AccessibilityContext';

export const ColorBlindModeSelector = () => {
  const { colorBlindMode, setColorBlindMode } = useAccessibility();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorBlindMode(event.target.value as ColorBlindMode);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, marginBottom: 1.5 }}>
        Modo Daltônico
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
        Aplique filtros de correção de cor para diferentes tipos de daltonismo.
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={colorBlindMode}
          onChange={handleChange}
          aria-label="Modo daltônico"
        >
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="Nenhum (Normal)"
            aria-label="Sem filtro de daltonismo"
          />
          <FormControlLabel
            value="protanopia"
            control={<Radio />}
            label="Protanopia (Ausência de cones vermelhos)"
            aria-label="Filtro para protanopia"
          />
          <FormControlLabel
            value="deuteranopia"
            control={<Radio />}
            label="Deuteranopia (Ausência de cones verdes)"
            aria-label="Filtro para deuteranopia"
          />
          <FormControlLabel
            value="tritanopia"
            control={<Radio />}
            label="Tritanopia (Ausência de cones azuis)"
            aria-label="Filtro para tritanopia"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

