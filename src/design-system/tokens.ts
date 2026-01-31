/**
 * Design System Tokens - Participa DF
 * Única fonte de verdade para cores, espaçamento, tipografia, raios e elevação.
 * Uso: import { tokens } from '@/design-system'
 */

export const tokens = {
  color: {
    brand: {
      primary: '#005FDB',
      primaryHover: '#0048A8',
      primaryLight: '#3385E5',
      secondary: '#E1007A',
      secondaryHover: '#B80062',
      accent: '#FFC107',
      accentDark: '#F57C00',
    },
    semantic: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222 47% 11%)',
      muted: 'hsl(220 14% 96%)',
      mutedForeground: 'hsl(220 9% 46%)',
      border: 'hsl(220 13% 84%)',
      input: 'hsl(220 13% 84%)',
      ring: 'hsl(214 100% 43%)',
      destructive: 'hsl(0 84% 60%)',
      success: '#16a34a',
      successHover: '#15803d',
    },
    surface: {
      header: '#0a1628',
      footer: '#0a1628',
      card: 'hsl(0 0% 100%)',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  radius: {
    none: '0',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'].join(','),
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    },
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    card: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
    cardHover: '0 4px 14px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  /** Uso: cards/panéis = rounded-lg, inputs/botões/alertas = rounded-xl */
  radiusUsage: {
    card: 'rounded-lg',
    input: 'rounded-xl',
    button: 'rounded-lg',
    alert: 'rounded-xl',
  },
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 40,
    modal: 50,
    popover: 60,
    toast: 70,
  },
  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
} as const;

export type Tokens = typeof tokens;
