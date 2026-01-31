import { useState, useEffect } from 'react';

/**
 * Hook para detectar breakpoint de mídia.
 * Responsabilidade única: observar matchMedia e retornar boolean.
 * @param query - Media query (ex: '(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

const BREAKPOINT_MD = 768;

/**
 * Hook para detectar viewport mobile (< 768px).
 * Encapsula useMediaQuery com breakpoint padrão do design system.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINT_MD}px)`);
}
