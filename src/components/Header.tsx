import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogIn, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccessibilityButtons } from '@/components/AccessibilityButtons';
import { MAIN_NAV_ITEMS, ROUTES } from '@/config';
import { tokens } from '@/design-system';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const COMPACT_HEADER_HEIGHT = 36; // só barra azul (h-9)
const FULL_HEADER_HEIGHT = 92; // barra azul + barra branca (h-9 + h-14)

export interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  /** Quando true, mostra só a barra azul (Governo + Entrar). Usado quando a sidebar está visível. */
  compact?: boolean;
}

export function Header({
  onMenuClick,
  isMobile = false,
  compact = false,
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) =>
    path !== ROUTES.HOME && location.pathname.startsWith(path);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b border-[#0a1628]/50 bg-[#0a1628] shadow-sm',
        !compact && 'border-b-border bg-white'
      )}
      role="banner"
      style={{ zIndex: tokens.zIndex.modal }}
    >
      <div className="flex h-9 items-center justify-end gap-2 bg-[#0a1628] px-4 sm:px-6 lg:px-8">
        <span className="mr-auto text-xs text-white">Governo do Distrito Federal</span>
        <AccessibilityButtons variant="header" className="shrink-0" />
        <Button
          asChild
          size="sm"
          className="h-7 gap-1 rounded-md border border-white/30 bg-transparent px-3 text-xs font-medium text-white hover:bg-white/10"
        >
          <Link to={ROUTES.HOME}>
            Entrar
            <LogIn className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </Button>
      </div>
      {!compact && (
      <div className="flex h-14 items-center justify-between gap-4 border-b border-border bg-white px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2"
          aria-label="Participa DF - Página inicial"
        >
          <img
            src="/logo-participa-azul.svg"
            alt=""
            className="h-8 w-auto"
            aria-hidden
          />
          <span className="hidden text-lg text-foreground sr-only sm:inline">Participa DF</span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Navegação principal"
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const hasDropdown = item.hasDropdown && item.dropdown?.length;

            if (hasDropdown && item.dropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue',
                        isActive(item.path) && 'bg-muted text-participa-blue'
                      )}
                      aria-haspopup="menu"
                      aria-expanded="false"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 p-1">
                    {item.dropdown.map((sub) => (
                      <DropdownMenuItem
                        key={sub.title}
                        external={sub.external}
                        onSelect={() => {
                          if (!sub.external && !sub.path.startsWith('#')) {
                            navigate(sub.path);
                          }
                        }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{sub.title}</span>
                          <span className="text-xs text-muted-foreground">{sub.subtitle}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={`${item.path}-${item.label}`}
                to={item.path}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue',
                  isActive(item.path) && 'bg-muted text-participa-blue'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {isMobile && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Abrir menu"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      )}
    </header>
  );
}

export { COMPACT_HEADER_HEIGHT, FULL_HEADER_HEIGHT };
