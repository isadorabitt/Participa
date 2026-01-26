import { Box, Typography, Paper } from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Forward as ForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: 'enviado',
    title: 'Registro Enviado',
    description: 'Seu registro foi recebido e está no sistema',
    icon: <SendIcon />,
    color: '#005FDB',
    gradient: 'linear-gradient(135deg, #005FDB 0%, #0048A8 100%)',
  },
  {
    id: 'analise',
    title: 'Em Análise',
    description: 'Nossa equipe está analisando sua manifestação',
    icon: <SearchIcon />,
    color: '#FFC107',
    gradient: 'linear-gradient(135deg, #FFC107 0%, #F57C00 100%)',
  },
  {
    id: 'encaminhado',
    title: 'Encaminhado',
    description: 'O registro foi encaminhado para o setor responsável',
    icon: <ForwardIcon />,
    color: '#E1007A',
    gradient: 'linear-gradient(135deg, #E1007A 0%, #B80062 100%)',
  },
  {
    id: 'respondido',
    title: 'Respondido',
    description: 'Sua manifestação foi respondida e finalizada',
    icon: <CheckCircleIcon />,
    color: '#2E7D32',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  },
];

export const ProtocolTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [animatedSteps, setAnimatedSteps] = useState<Set<number>>(new Set());

  // Animação sequencial dos steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < timelineSteps.length - 1) {
          const nextStep = prev + 1;
          setAnimatedSteps((prevSet) => new Set([...prevSet, nextStep]));
          return nextStep;
        }
        return prev;
      });
    }, 800);

    // Iniciar com o primeiro step
    setAnimatedSteps(new Set([0]));

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          marginBottom: 4,
          textAlign: 'center',
          color: '#1A1A1A',
        }}
      >
        Acompanhamento do Protocolo
      </Typography>

      {/* Timeline Desktop (Horizontal) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          paddingY: 4,
        }}
      >
        {/* Linha conectora */}
        <Box
          sx={{
            position: 'absolute',
            top: '60px',
            left: '10%',
            right: '10%',
            height: '4px',
            background: 'linear-gradient(90deg, #005FDB 0%, #FFC107 50%, #E1007A 75%, #2E7D32 100%)',
            borderRadius: 2,
            zIndex: 0,
            transition: 'all 0.5s ease-in-out',
          }}
        />

        {timelineSteps.map((step, index) => {
          const isActive = index <= activeStep;
          const isAnimated = animatedSteps.has(index);

          return (
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Ícone */}
              <Paper
                elevation={isActive ? 8 : 2}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? step.gradient : '#E8E9EB',
                  color: isActive ? '#FFFFFF' : '#8B9099',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isAnimated
                    ? 'scale(1.1) rotate(360deg)'
                    : isActive
                    ? 'scale(1.05)'
                    : 'scale(1)',
                  animation: isAnimated
                    ? 'pulse 0.6s ease-in-out'
                    : 'none',
                  '& svg': {
                    fontSize: 48,
                    transition: 'all 0.3s ease-in-out',
                  },
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.15)',
                    },
                    '100%': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {step.icon}
              </Paper>

              {/* Conteúdo */}
              <Box
                sx={{
                  marginTop: 3,
                  textAlign: 'center',
                  maxWidth: 200,
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isActive ? '#1A1A1A' : '#8B9099',
                    marginBottom: 1,
                    fontSize: '1.125rem',
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isActive ? '#4A4A4A' : '#8B9099',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>

              {/* Indicador de progresso */}
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50px',
                    width: '100%',
                    height: '4px',
                    background: step.gradient,
                    borderRadius: 2,
                    zIndex: 2,
                    animation: 'slideIn 0.5s ease-in-out',
                    '@keyframes slideIn': {
                      '0%': {
                        width: '0%',
                      },
                      '100%': {
                        width: '100%',
                      },
                    },
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Timeline Mobile (Vertical) */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: 3,
          paddingX: 2,
        }}
      >
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeStep;
          const isAnimated = animatedSteps.has(index);

          return (
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                position: 'relative',
                paddingLeft: 4,
              }}
            >
              {/* Linha vertical conectora */}
              {index < timelineSteps.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '23px',
                    top: '60px',
                    bottom: '-24px',
                    width: '4px',
                    background: isActive
                      ? `linear-gradient(180deg, ${step.color} 0%, ${timelineSteps[index + 1].color} 100%)`
                      : '#E8E9EB',
                    borderRadius: 2,
                    transition: 'background 0.5s ease-in-out',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Ícone */}
              <Paper
                elevation={isActive ? 8 : 2}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? step.gradient : '#E8E9EB',
                  color: isActive ? '#FFFFFF' : '#8B9099',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isAnimated
                    ? 'scale(1.15) rotate(360deg)'
                    : isActive
                    ? 'scale(1.05)'
                    : 'scale(1)',
                  animation: isAnimated
                    ? 'pulseMobile 0.6s ease-in-out'
                    : 'none',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                  '& svg': {
                    fontSize: 28,
                    transition: 'all 0.3s ease-in-out',
                  },
                  '@keyframes pulseMobile': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.2)',
                    },
                    '100%': {
                      transform: 'scale(1.15)',
                    },
                  },
                }}
              >
                {step.icon}
              </Paper>

              {/* Conteúdo */}
              <Box
                sx={{
                  flex: 1,
                  paddingTop: 1,
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isActive ? '#1A1A1A' : '#8B9099',
                    marginBottom: 0.5,
                    fontSize: '1rem',
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isActive ? '#4A4A4A' : '#8B9099',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

