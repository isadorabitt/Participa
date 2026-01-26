import { Fab } from '@mui/material';
import { SmartToy as SmartToyIcon } from '@mui/icons-material';
import { Box } from '@mui/material';

interface IzaButtonProps {
  onClick: () => void;
  isPulsing?: boolean;
  hasNotification?: boolean;
}

export const IzaButton = ({ onClick, isPulsing = false, hasNotification = false }: IzaButtonProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Círculo pulsante de fundo */}
      {isPulsing && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#E1007A',
            opacity: 0.3,
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse-ring': {
              '0%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 0.5,
              },
              '50%': {
                transform: 'translate(-50%, -50%) scale(1.3)',
                opacity: 0.2,
              },
              '100%': {
                transform: 'translate(-50%, -50%) scale(1.6)',
                opacity: 0,
              },
            },
          }}
        />
      )}

      {/* Indicador de notificação */}
      {hasNotification && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#FFC107',
            border: '2px solid white',
            zIndex: 1,
            animation: 'notification-blink 1.5s ease-in-out infinite',
            '@keyframes notification-blink': {
              '0%, 100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
              '50%': {
                opacity: 0.7,
                transform: 'scale(1.1)',
              },
            },
          }}
        />
      )}

      <Fab
        color="primary"
        aria-label="Abrir assistente virtual IZA"
        onClick={onClick}
        sx={{
          position: 'relative',
          backgroundColor: '#E1007A',
          width: 64,
          height: 64,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isPulsing
            ? 'button-float 3s ease-in-out infinite'
            : 'none',
          '&:hover': {
            backgroundColor: '#B80062',
            transform: 'scale(1.1)',
            boxShadow: '0px 8px 16px rgba(225, 0, 122, 0.4)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&:focus-visible': {
            outline: '3px solid',
            outlineColor: '#E1007A',
            outlineOffset: '2px',
          },
          '@keyframes button-float': {
            '0%, 100%': {
              transform: 'translateY(0px)',
            },
            '50%': {
              transform: 'translateY(-8px)',
            },
          },
        }}
      >
        <SmartToyIcon
          sx={{
            fontSize: 32,
            animation: isPulsing
              ? 'icon-wiggle 2s ease-in-out infinite'
              : 'none',
            '@keyframes icon-wiggle': {
              '0%, 100%': {
                transform: 'rotate(0deg)',
              },
              '25%': {
                transform: 'rotate(-5deg)',
              },
              '75%': {
                transform: 'rotate(5deg)',
              },
            },
          }}
        />
      </Fab>
    </Box>
  );
};

