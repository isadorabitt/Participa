import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para gerenciar atalhos de teclado de acessibilidade
 */
export const useKeyboardShortcuts = (onAccessibilityClick?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input, textarea ou contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // ALT + N → Novo Registro
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        navigate('/novo-registro');
      }

      // ALT + I → Início
      if (event.altKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        navigate('/');
      }

      // ALT + A → Acessibilidade
      if (event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        if (onAccessibilityClick) {
          onAccessibilityClick();
        }
      }

      // ALT + M → Menu (toggle sidebar em mobile)
      if (event.altKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        // Disparar evento customizado para toggle do menu
        window.dispatchEvent(new CustomEvent('toggle-menu'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, onAccessibilityClick]);
};

