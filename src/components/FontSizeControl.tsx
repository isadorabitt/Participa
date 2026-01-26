import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { Remove as RemoveIcon, Add as AddIcon, RestartAlt as RestartIcon } from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

export const FontSizeControl = () => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  const canIncrease = fontSize < MAX_FONT_SIZE;
  const canDecrease = fontSize > MIN_FONT_SIZE;
  const isDefault = fontSize === DEFAULT_FONT_SIZE;

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="body1" gutterBottom>
        Tamanho da Fonte
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Diminuir fonte (Alt + -)" arrow>
          <span>
            <IconButton
              onClick={decreaseFontSize}
              disabled={!canDecrease}
              aria-label="Diminuir tamanho da fonte"
              aria-describedby="font-size-description"
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <RemoveIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Typography
          variant="body1"
          sx={{
            minWidth: '60px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {fontSize}px
        </Typography>

        <Tooltip title="Aumentar fonte (Alt + +)" arrow>
          <span>
            <IconButton
              onClick={increaseFontSize}
              disabled={!canIncrease}
              aria-label="Aumentar tamanho da fonte"
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Resetar para tamanho padrão (Alt + 0)" arrow>
          <span>
            <IconButton
              onClick={resetFontSize}
              disabled={isDefault}
              aria-label="Resetar tamanho da fonte para padrão"
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                marginLeft: 1,
              }}
            >
              <RestartIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Typography
        id="font-size-description"
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', marginTop: 0.5 }}
      >
        Ajuste o tamanho da fonte para melhorar a legibilidade
      </Typography>
    </Box>
  );
};

