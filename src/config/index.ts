/**
 * Configuração da aplicação - ponto único de exportação
 */

export {
  ROUTES,
  MAIN_NAV_ITEMS,
  SIDEBAR_NAV_ITEMS,
  MANIFESTACOES_DROPDOWN,
  AJUDA_DROPDOWN,
  TRANSPARENCIA_DROPDOWN,
} from './navigation';
export type {
  NavItem,
  RoutePath,
  SidebarNavItem,
  SidebarIconName,
  DropdownItem,
} from './navigation';

export {
  FOOTER_LINKS,
  FOOTER_ADDRESS,
  SOCIAL_LINKS,
} from './footer';
export type { FooterLink, SocialLink } from './footer';
