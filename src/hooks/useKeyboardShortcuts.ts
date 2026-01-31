import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config';

/**
 * Hook para gerenciar atalhos de teclado de acessibilidade.
 * Responsabilidade única: registrar listeners e delegar navegação/callbacks.
 */
export function useKeyboardShortcuts(onAccessibilityClick?: () => void): void {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if (isTyping) return;

      const key = event.key.toLowerCase();

      if (event.altKey && key === 'n') {
        event.preventDefault();
        navigate(ROUTES.NEW_REPORT);
        return;
      }
      if (event.altKey && key === 'i') {
        event.preventDefault();
        navigate(ROUTES.HOME);
        return;
      }

      if (event.altKey && key === 'a') {
        event.preventDefault();
        onAccessibilityClick?.();
        return;
      }
      if (event.altKey && key === 'm') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-menu'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, onAccessibilityClick]);
};

