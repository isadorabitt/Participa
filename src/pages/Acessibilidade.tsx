import { Box, Typography, Paper, Container } from '@mui/material';
import { HighContrastToggle } from '../components/HighContrastToggle';
import { FontSizeControl } from '../components/FontSizeControl';

export const Acessibilidade = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Acessibilidade
        </Typography>
        <Typography variant="body1" paragraph>
          Configure as opções de acessibilidade para melhorar sua experiência de uso do sistema.
        </Typography>

        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Configurações de Acessibilidade
          </Typography>
          <HighContrastToggle />
          <FontSizeControl />
        </Paper>

        <Paper sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sobre a Acessibilidade
          </Typography>
          <Typography variant="body2" paragraph>
            Este sistema foi desenvolvido seguindo as diretrizes WCAG 2.1 Nível AA, garantindo
            que seja acessível para todos os usuários.
          </Typography>
          <Typography variant="body2" paragraph>
            As funcionalidades de acessibilidade incluem:
          </Typography>
          <Box component="ul" sx={{ paddingLeft: 3 }}>
            <li>
              <Typography variant="body2">
                <strong>Alto Contraste:</strong> Aumenta o contraste entre texto e fundo para
                melhorar a legibilidade.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Controle de Tamanho de Fonte:</strong> Permite ajustar o tamanho da fonte
                de 14px a 24px.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Navegação por Teclado:</strong> Todos os recursos podem ser acessados
                através de atalhos de teclado.
              </Typography>
            </li>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

