import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AccessibilityDialog } from './AccessibilityDialog';
import { VirtualAssistant } from './VirtualAssistant';
import { Outlet } from 'react-router-dom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ColorBlindFilters } from '../utils/colorBlindFilters';

export const Layout = () => {
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccessibilityClick = () => {
    setAccessibilityDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAccessibilityDialogOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Atalhos de teclado
  useKeyboardShortcuts(handleAccessibilityClick);

  // Listener para toggle do menu via atalho
  useEffect(() => {
    const handleToggleMenu = () => {
      if (isMobile) {
        handleMobileMenuToggle();
      }
    };

    const handleOpenAccessibility = () => {
      setAccessibilityDialogOpen(true);
    };

    window.addEventListener('toggle-menu', handleToggleMenu);
    window.addEventListener('open-accessibility-dialog', handleOpenAccessibility);
    
    return () => {
      window.removeEventListener('toggle-menu', handleToggleMenu);
      window.removeEventListener('open-accessibility-dialog', handleOpenAccessibility);
    };
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onAccessibilityClick={handleAccessibilityClick}
        onMenuClick={isMobile ? handleMobileMenuToggle : undefined}
      />
      <Box sx={{ display: 'flex', flex: 1, marginTop: '64px' }}>
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={handleMobileMenuClose} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 3, sm: 4, md: 5 },
            backgroundColor: '#FAFBFC',
            minHeight: 'calc(100vh - 128px)',
            width: { xs: '100%', md: `calc(100% - 240px)` },
            marginLeft: { xs: 0, md: '240px' },
            marginTop: { xs: '64px', sm: '72px' },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
      <AccessibilityDialog open={accessibilityDialogOpen} onClose={handleCloseDialog} />
      <VirtualAssistant />
      <ColorBlindFilters />
    </Box>
  );
};

