import { FormControlLabel, Switch, Typography, Box, Tooltip } from '@mui/material';
import { useAccessibility } from '../context/AccessibilityContext';

export const HighContrastToggle = () => {
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Tooltip title="Atalho: Alt + C" arrow>
        <FormControlLabel
          control={
            <Switch
              checked={highContrast}
              onChange={toggleHighContrast}
              color="primary"
              aria-label="Alternar alto contraste"
              aria-describedby="high-contrast-description"
            />
          }
          label={
            <Typography variant="body1" component="span">
              Alto Contraste
            </Typography>
          }
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: 'inherit',
            },
          }}
        />
      </Tooltip>
      <Typography
        id="high-contrast-description"
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', marginTop: 0.5 }}
      >
        Aumenta o contraste entre texto e fundo para melhorar a legibilidade
      </Typography>
    </Box>
  );
};

