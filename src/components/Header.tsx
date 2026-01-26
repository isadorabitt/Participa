import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
import { Accessibility as AccessibilityIcon, Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  onAccessibilityClick?: () => void;
  onMenuClick?: () => void;
}

export const Header = ({ onAccessibilityClick, onMenuClick }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #005FDB 0%, #0048A8 100%)',
        boxShadow: '0px 2px 8px rgba(0, 95, 219, 0.15)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, paddingX: { xs: 2, sm: 3 } }}>
        {isMobile && onMenuClick && (
          <IconButton
            color="inherit"
            aria-label="Abrir menu de navegação"
            onClick={onMenuClick}
            edge="start"
            sx={{
              marginRight: 2,
              padding: 1.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              '&:focus-visible': {
                outline: '3px solid',
                outlineColor: 'rgba(255, 255, 255, 0.5)',
                outlineOffset: '2px',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src="/logo-ouvidoria.svg"
            alt="Logo Ouvidoria do Governo do Distrito Federal"
            sx={{
              height: { xs: 32, sm: 40 },
              width: 'auto',
              maxWidth: { xs: 130, sm: 160 },
              objectFit: 'contain',
              marginRight: 1.5,
              filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))',
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.375rem' },
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
            }}
          >
            Ouvidoria
          </Typography>
        </Box>
        <IconButton
          color="inherit"
          aria-label="Configurações de acessibilidade"
          onClick={onAccessibilityClick}
          sx={{
            marginLeft: 2,
            padding: 1.5,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.05)',
            },
            '&:focus-visible': {
              outline: '3px solid',
              outlineColor: 'rgba(255, 255, 255, 0.5)',
              outlineOffset: '2px',
            },
          }}
        >
          <AccessibilityIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

