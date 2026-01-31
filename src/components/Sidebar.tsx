import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  ClipboardList,
  Info,
  HelpCircle,
  MessageCircle,
  Accessibility,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from '@/config';
import type { SidebarIconName } from '@/config';
import { tokens } from '@/design-system';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

const ICON_MAP: Record<SidebarIconName, LucideIcon> = {
  home: Home,
  plusCircle: PlusCircle,
  clipboardList: ClipboardList,
  info: Info,
  helpCircle: HelpCircle,
  messageCircle: MessageCircle,
  accessibility: Accessibility,
  mapPin: MapPin,
};

export interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  isMobile = false,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-auto">
      <div
        className={cn(
          'flex items-center border-b border-border transition-[padding] duration-200',
          collapsed ? 'justify-center px-0 py-4' : 'px-4 py-4'
        )}
      >
        <Link
          to="/"
          className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2 rounded-md"
          aria-label="Participa DF - Página inicial"
        >
          {collapsed ? (
            <img
              src="/logo-participa-azul.svg"
              alt=""
              className="h-8 w-8 object-contain"
              aria-hidden
            />
          ) : (
            <img
              src="/logo-participa-azul.svg"
              alt=""
              className="h-8 w-full max-w-[160px] object-contain object-left"
              aria-hidden
            />
          )}
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4" aria-label="Navegação principal">
        <ul className="space-y-0.5">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const isSelected = location.pathname === item.path;
            const Icon = ICON_MAP[item.icon];
            return (
              <li key={`${item.path}-${item.label}`}>
                <Link
                  to={item.path}
                  onClick={isMobile ? onMobileClose : undefined}
                  aria-current={isSelected ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2',
                    collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                    isSelected
                      ? 'bg-participa-blue/10 text-participa-blue'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      isSelected ? 'bg-participa-blue/20 text-participa-blue' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {!isMobile && onToggleCollapse && (
        <div className="border-t border-border p-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className={cn(
              'h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" aria-hidden />
            ) : (
              <PanelLeftClose className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            'fixed inset-0 bg-black/50 transition-opacity md:hidden',
            mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          style={{ zIndex: tokens.zIndex.overlay }}
          aria-hidden
          onClick={onMobileClose}
        />
        <aside
          className={cn(
            'fixed left-0 top-0 z-[100] w-[280px] max-w-[85vw] border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out md:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{
            top: '92px',
            height: 'calc(100vh - 92px)',
            zIndex: tokens.zIndex.modal,
          }}
          aria-label="Menu lateral"
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        'hidden shrink-0 border-r border-border bg-card transition-[width] duration-200 ease-out md:block',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
      style={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
      aria-label="Menu lateral"
    >
      {sidebarContent}
    </aside>
  );
}
