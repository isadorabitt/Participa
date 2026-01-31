import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Accessibility as AccessibilityIcon } from '@mui/icons-material';

interface HeaderProps {
  onAccessibilityClick?: () => void;
}

export const Header = ({ onAccessibilityClick }: HeaderProps) => {

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 95, 219, 0.08)',
        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.03)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, paddingX: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src="/logo-ouvidoria.svg"
            alt="Logo Ouvidoria"
            sx={{
              height: { xs: 32, sm: 38 },
              width: 'auto',
              marginRight: 2,
              filter: 'grayscale(0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'grayscale(0)',
                transform: 'scale(1.02)'
              }
            }}
          />
          <Box
            sx={{
              width: '1px',
              height: '24px',
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              marginRight: 2,
              display: { xs: 'none', sm: 'block' }
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              letterSpacing: '-0.02em',
              color: '#005FDB',
              textTransform: 'uppercase',
            }}
          >
            Ouvidoria
          </Typography>
        </Box>
        <IconButton
          aria-label="Configurações de acessibilidade"
          onClick={onAccessibilityClick}
          sx={{
            padding: 1.25,
            color: '#005FDB',
            backgroundColor: 'rgba(0, 95, 219, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 95, 219, 0.1)',
              transform: 'translateY(-2px)',
              boxShadow: '0px 4px 12px rgba(0, 95, 219, 0.15)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          <AccessibilityIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

