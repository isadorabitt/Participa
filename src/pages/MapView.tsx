import { Container, Typography, Box } from '@mui/material';
import { ThematicMap } from '../components/ThematicMap';
import { useAccessibility } from '../context/AccessibilityContext';

export const MapView = () => {
  const { fontSize } = useAccessibility();

  return (
    <Container maxWidth="xl">
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: `calc(${fontSize}px * 1.75)`, sm: `calc(${fontSize}px * 2.125)` },
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 2,
          }}
        >
          Mapa Temático de Registros
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: `calc(${fontSize}px * 1.125)`,
            color: '#4A4A4A',
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          Visualize no mapa os locais onde você criou registros. Os marcadores são organizados 
          por tipo de manifestação e salvos apenas no seu navegador.
        </Typography>
      </Box>

      <ThematicMap />
    </Container>
  );
};

