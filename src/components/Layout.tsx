import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AccessibilityDialog } from './AccessibilityDialog';
import { VirtualAssistant } from './VirtualAssistant';
import { MobileTabBar } from './MobileTabBar';
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
      // Menu removido em favor da TabBar
      />
      <Box sx={{ display: 'flex', flex: 1, marginTop: { xs: '64px', sm: '72px' } }}>
        {!isMobile && <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={handleMobileMenuClose} />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4, md: 6 },
            backgroundColor: '#FAFBFC',
            minHeight: 'calc(100vh - 72px)',
            width: { xs: '100%', md: `calc(100% - 240px)` },
            marginLeft: { xs: 0, md: '240px' },
            paddingBottom: { xs: '100px', md: '60px' }, // Espaço para a TabBar no mobile
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
      <MobileTabBar />
      <AccessibilityDialog open={accessibilityDialogOpen} onClose={handleCloseDialog} />
      <VirtualAssistant />
      <ColorBlindFilters />
    </Box>
  );
};

