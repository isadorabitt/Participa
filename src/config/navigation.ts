/**
 * Configuração de navegação - Single Source of Truth
 */

export const ROUTES = {
  HOME: '/',
  NEW_REPORT: '/novo-registro',
  MY_REPORTS: '/meus-registros',
  MAP: '/mapa',
  ABOUT: '/ouvidoria',
  GUIDELINES: '/orientacoes',
  FAQ: '/faq',
  ACCESSIBILITY: '/acessibilidade',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export interface NavItem {
  label: string;
  path: RoutePath | string;
  hasDropdown?: boolean;
}

export interface DropdownItem {
  title: string;
  subtitle: string;
  path: RoutePath | string;
  external?: boolean;
}

export const MANIFESTACOES_DROPDOWN: DropdownItem[] = [
  { title: 'Nova Manifestação', subtitle: 'Registre sua manifestação', path: '/novo-registro' },
  { title: 'Acompanhar Registro', subtitle: 'Consulte seus protocolos', path: '/meus-registros' },
  { title: 'Orientações', subtitle: 'Como registrar sua manifestação', path: '/orientacoes' },
];

export const AJUDA_DROPDOWN: DropdownItem[] = [
  { title: 'Orientações', subtitle: 'Passo a passo para registrar', path: '/orientacoes' },
  { title: 'FAQ', subtitle: 'Perguntas frequentes', path: '/faq' },
  { title: 'Acessibilidade', subtitle: 'Recursos de acessibilidade', path: '/acessibilidade' },
];

export const TRANSPARENCIA_DROPDOWN: DropdownItem[] = [
  { title: 'Painel de Ouvidoria', subtitle: 'Dashboard de manifestações', path: '#', external: true },
  { title: 'Transparência Passiva', subtitle: 'Acesso à informação', path: '#', external: true },
  { title: 'Portal da Transparência', subtitle: 'Receitas e despesas', path: '#', external: true },
  { title: 'Portal de Dados Abertos', subtitle: 'Conjuntos de dados', path: '#', external: true },
];

export type SidebarIconName =
  | 'home'
  | 'plusCircle'
  | 'clipboardList'
  | 'mapPin'
  | 'info'
  | 'helpCircle'
  | 'messageCircle'
  | 'accessibility';

export interface SidebarNavItem extends NavItem {
  icon: SidebarIconName;
}

export const MAIN_NAV_ITEMS: (NavItem & { dropdown?: DropdownItem[] })[] = [
  { label: 'Início', path: ROUTES.HOME },
  { label: 'Manifestações', path: ROUTES.NEW_REPORT, hasDropdown: true, dropdown: MANIFESTACOES_DROPDOWN },
  { label: 'Ajuda', path: ROUTES.GUIDELINES, hasDropdown: true, dropdown: AJUDA_DROPDOWN },
  { label: 'Transparência', path: ROUTES.HOME, hasDropdown: true, dropdown: TRANSPARENCIA_DROPDOWN },
];

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Início', path: ROUTES.HOME, icon: 'home' },
  { label: 'Novo Registro', path: ROUTES.NEW_REPORT, icon: 'plusCircle' },
  { label: 'Meus Registros', path: ROUTES.MY_REPORTS, icon: 'clipboardList' },
  { label: 'Mapa Temático', path: ROUTES.MAP, icon: 'mapPin' },
  { label: 'O que é Ouvidoria', path: ROUTES.ABOUT, icon: 'info' },
  { label: 'Orientações', path: ROUTES.GUIDELINES, icon: 'helpCircle' },
  { label: 'FAQ', path: ROUTES.FAQ, icon: 'messageCircle' },
  { label: 'Acessibilidade', path: ROUTES.ACCESSIBILITY, icon: 'accessibility' },
];
