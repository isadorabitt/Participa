import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, FULL_HEADER_HEIGHT, COMPACT_HEADER_HEIGHT } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { VirtualAssistant } from './VirtualAssistant';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ColorBlindFilters } from '@/utils/colorBlindFilters';
import { cn } from '@/lib/utils';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}


export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const isHome = location.pathname === '/';
  const showSidebar = !isHome;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMobileMenuToggle = () => setMobileMenuOpen((prev) => !prev);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  useKeyboardShortcuts();

  useEffect(() => {
    const handleToggleMenu = () => {
      if (isMobile) setMobileMenuOpen((prev) => !prev);
    };
    globalThis.addEventListener('toggle-menu', handleToggleMenu);
    return () => {
      globalThis.removeEventListener('toggle-menu', handleToggleMenu);
    };
  }, [isMobile]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        compact={showSidebar}
        onMenuClick={isMobile ? handleMobileMenuToggle : undefined}
        isMobile={isMobile}
      />
      <div
        className="flex flex-1"
        style={{ paddingTop: showSidebar ? `${COMPACT_HEADER_HEIGHT}px` : `${FULL_HEADER_HEIGHT}px` }}
      >
        {showSidebar && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            mobileOpen={mobileMenuOpen}
            onMobileClose={handleMobileMenuClose}
            isMobile={isMobile}
          />
        )}
        <main
          className={cn(
            'min-h-[calc(100vh-4rem)] min-w-0 flex-1 bg-background',
            showSidebar ? 'w-full p-4 sm:p-6 md:p-6' : 'w-full',
            showSidebar && sidebarCollapsed && 'md:w-[calc(100%-72px)]',
            showSidebar && !sidebarCollapsed && 'md:w-[calc(100%-240px)]'
          )}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
      <VirtualAssistant />
      <ColorBlindFilters />
    </div>
  );
}
