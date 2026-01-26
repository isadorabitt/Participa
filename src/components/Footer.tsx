import { Box, Container, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        padding: { xs: 3, sm: 4 },
        marginTop: 'auto',
        borderTop: '1px solid #E8E9EB',
      }}
      role="contentinfo"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 4, sm: 6 },
            marginBottom: 3,
            flexWrap: 'wrap',
            paddingY: 2.5,
          }}
        >
          <Box
            component="img"
            src="/logo-ouvidoria.svg"
            alt="Logo Ouvidoria do Governo do Distrito Federal"
            sx={{
              height: { xs: 55, sm: 75 },
              width: 'auto',
              maxWidth: { xs: '45%', sm: 'auto' },
              objectFit: 'contain',
              filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08))',
            }}
          />
          <Box
            component="img"
            src="/logo-participa-azul.svg"
            alt="Logo Participa DF"
            sx={{
              height: { xs: 45, sm: 65 },
              width: 'auto',
              maxWidth: { xs: '45%', sm: 'auto' },
              objectFit: 'contain',
              filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08))',
            }}
          />
        </Box>
        <Box
          sx={{
            borderTop: '1px solid #E8E9EB',
            paddingTop: 3,
            marginTop: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              color: '#4A4A4A',
              textAlign: 'center',
              fontWeight: 500,
              marginBottom: 1,
            }}
          >
            © {new Date().getFullYear()} Ouvidoria do Governo do Distrito Federal - Participa DF
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              color: '#8B9099',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Desenvolvido com foco em transparência e participação cidadã
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

