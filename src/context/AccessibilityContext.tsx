import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: number;
  colorBlindMode: ColorBlindMode;
  easyReading: boolean;
  textOnly: boolean;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  toggleEasyReading: () => void;
  toggleTextOnly: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HIGH_CONTRAST: 'accessibility_high_contrast',
  FONT_SIZE: 'accessibility_font_size',
  COLOR_BLIND: 'accessibility_color_blind',
  EASY_READING: 'accessibility_easy_reading',
  TEXT_ONLY: 'accessibility_text_only',
};

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_STEP = 2;

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST);
    return stored === 'true';
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (stored) {
      const parsedSize = parseInt(stored, 10);
      if (parsedSize >= MIN_FONT_SIZE && parsedSize <= MAX_FONT_SIZE) {
        return parsedSize;
      }
    }
    return DEFAULT_FONT_SIZE;
  });

  const [colorBlindMode, setColorBlindModeState] = useState<ColorBlindMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.COLOR_BLIND);
    if (stored && ['none', 'protanopia', 'deuteranopia', 'tritanopia'].includes(stored)) {
      return stored as ColorBlindMode;
    }
    return 'none';
  });

  const [easyReading, setEasyReading] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.EASY_READING);
    return stored === 'true';
  });

  const [textOnly, setTextOnly] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TEXT_ONLY);
    return stored === 'true';
  });

  // Salvar preferências no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, String(fontSize));
    // Aplicar tamanho de fonte globalmente
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Salvar preferências no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLOR_BLIND, colorBlindMode);
  }, [colorBlindMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EASY_READING, String(easyReading));
  }, [easyReading]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEXT_ONLY, String(textOnly));
  }, [textOnly]);

  // Aplicar modos de acessibilidade globalmente
  useEffect(() => {
    // Alto contraste
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Modo daltônico
    document.body.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    if (colorBlindMode !== 'none') {
      document.body.classList.add(`colorblind-${colorBlindMode}`);
    }

    // Modo leitura fácil
    if (easyReading) {
      document.body.classList.add('easy-reading');
    } else {
      document.body.classList.remove('easy-reading');
    }

    // Modo somente texto
    if (textOnly) {
      document.body.classList.add('text-only');
    } else {
      document.body.classList.remove('text-only');
    }
  }, [highContrast, colorBlindMode, easyReading, textOnly]);

  // Navegação por teclado e atalhos
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + C para alternar alto contraste
      if (event.altKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        setHighContrast((prev) => !prev);
      }
      // Alt + + para aumentar fonte
      if (event.altKey && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        setFontSize((prev) => Math.min(prev + FONT_SIZE_STEP, MAX_FONT_SIZE));
      }
      // Alt + - para diminuir fonte
      if (event.altKey && event.key === '-') {
        event.preventDefault();
        setFontSize((prev) => Math.max(prev - FONT_SIZE_STEP, MIN_FONT_SIZE));
      }
      // Alt + 0 para resetar fonte
      if (event.altKey && event.key === '0') {
        event.preventDefault();
        setFontSize(DEFAULT_FONT_SIZE);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const setColorBlindMode = (mode: ColorBlindMode) => {
    setColorBlindModeState(mode);
  };

  const toggleEasyReading = () => {
    setEasyReading((prev) => !prev);
  };

  const toggleTextOnly = () => {
    setTextOnly((prev) => !prev);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + FONT_SIZE_STEP, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - FONT_SIZE_STEP, MIN_FONT_SIZE));
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const value: AccessibilityContextType = {
    highContrast,
    fontSize,
    colorBlindMode,
    easyReading,
    textOnly,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setColorBlindMode,
    toggleEasyReading,
    toggleTextOnly,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

