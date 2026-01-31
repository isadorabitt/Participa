/**
 * Configuração do rodapé - Single Source of Truth
 */

export interface FooterLink {
  label: string;
  path: string;
}

/** Links principais do rodapé (uma única lista enxuta) */
export const FOOTER_LINKS: FooterLink[] = [
  { label: 'Acessibilidade', path: '/acessibilidade' },
  { label: 'Perguntas frequentes', path: '/faq' },
  { label: 'Orientações', path: '/orientacoes' },
  { label: 'O que é Ouvidoria', path: '/ouvidoria' },
  { label: 'Transparência', path: '#' },
];

export const FOOTER_ADDRESS = {
  text: 'Governo do Distrito Federal · Palácio do Buriti, Brasília – DF',
} as const;

export interface SocialLink {
  label: string;
  href: string;
  iconName: 'instagram' | 'facebook' | 'twitter' | 'youtube';
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', href: '#', iconName: 'instagram' },
  { label: 'Facebook', href: '#', iconName: 'facebook' },
  { label: 'X (Twitter)', href: '#', iconName: 'twitter' },
  { label: 'YouTube', href: '#', iconName: 'youtube' },
];
