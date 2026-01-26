import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ReportProvider } from './context/ReportContext';
import { Layout } from './components/Layout';
import { Inicio } from './pages/Inicio';
import { NewReport } from './pages/NewReport';
import { MyReports } from './pages/MyReports';
import { About } from './pages/About';
import { Guidelines } from './pages/Guidelines';
import { Faq } from './pages/Faq';
import { Acessibilidade } from './pages/Acessibilidade';
import { MapView } from './pages/MapView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005FDB',
      light: '#3385E5',
      dark: '#0048A8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E1007A',
      light: '#E63399',
      dark: '#B80062',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    error: {
      main: '#d32f2f',
      contrastText: '#ffffff',
    },
    info: {
      main: '#005FDB',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F4F5F7',
      100: '#E8E9EB',
      200: '#D1D3D6',
      300: '#B9BCC2',
      400: '#A2A6AD',
      500: '#8B9099',
      600: '#747A85',
      700: '#5D6370',
      800: '#464D5C',
      900: '#2F3647',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.06)',
    '0px 3px 6px rgba(0, 0, 0, 0.08), 0px 3px 4px rgba(0, 0, 0, 0.06)',
    '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 4px 5px rgba(0, 0, 0, 0.06)',
    '0px 5px 10px rgba(0, 0, 0, 0.08), 0px 5px 6px rgba(0, 0, 0, 0.06)',
    '0px 6px 12px rgba(0, 0, 0, 0.08), 0px 6px 7px rgba(0, 0, 0, 0.06)',
    '0px 7px 14px rgba(0, 0, 0, 0.08), 0px 7px 8px rgba(0, 0, 0, 0.06)',
    '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 8px 9px rgba(0, 0, 0, 0.06)',
    '0px 9px 18px rgba(0, 0, 0, 0.08), 0px 9px 10px rgba(0, 0, 0, 0.06)',
    '0px 10px 20px rgba(0, 0, 0, 0.08), 0px 10px 11px rgba(0, 0, 0, 0.06)',
    '0px 11px 22px rgba(0, 0, 0, 0.08), 0px 11px 12px rgba(0, 0, 0, 0.06)',
    '0px 12px 24px rgba(0, 0, 0, 0.08), 0px 12px 13px rgba(0, 0, 0, 0.06)',
    '0px 13px 26px rgba(0, 0, 0, 0.08), 0px 13px 14px rgba(0, 0, 0, 0.06)',
    '0px 14px 28px rgba(0, 0, 0, 0.08), 0px 14px 15px rgba(0, 0, 0, 0.06)',
    '0px 15px 30px rgba(0, 0, 0, 0.08), 0px 15px 16px rgba(0, 0, 0, 0.06)',
    '0px 16px 32px rgba(0, 0, 0, 0.08), 0px 16px 17px rgba(0, 0, 0, 0.06)',
    '0px 17px 34px rgba(0, 0, 0, 0.08), 0px 17px 18px rgba(0, 0, 0, 0.06)',
    '0px 18px 36px rgba(0, 0, 0, 0.08), 0px 18px 19px rgba(0, 0, 0, 0.06)',
    '0px 19px 38px rgba(0, 0, 0, 0.08), 0px 19px 20px rgba(0, 0, 0, 0.06)',
    '0px 20px 40px rgba(0, 0, 0, 0.08), 0px 20px 21px rgba(0, 0, 0, 0.06)',
    '0px 21px 42px rgba(0, 0, 0, 0.08), 0px 21px 22px rgba(0, 0, 0, 0.06)',
    '0px 22px 44px rgba(0, 0, 0, 0.08), 0px 22px 23px rgba(0, 0, 0, 0.06)',
    '0px 23px 46px rgba(0, 0, 0, 0.08), 0px 23px 24px rgba(0, 0, 0, 0.06)',
    '0px 24px 48px rgba(0, 0, 0, 0.08), 0px 24px 25px rgba(0, 0, 0, 0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: '3px solid',
            outlineColor: '#005FDB',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#005FDB',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: '#005FDB',
              },
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D3D6',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.06)',
        },
        elevation4: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 4px 5px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <AccessibilityProvider>
      <ReportProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path="novo-registro" element={<NewReport />} />
                <Route path="meus-registros" element={<MyReports />} />
                <Route path="ouvidoria" element={<About />} />
                <Route path="orientacoes" element={<Guidelines />} />
                <Route path="faq" element={<Faq />} />
                <Route path="acessibilidade" element={<Acessibilidade />} />
                <Route path="mapa" element={<MapView />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ReportProvider>
    </AccessibilityProvider>
  );
}

export default App;
