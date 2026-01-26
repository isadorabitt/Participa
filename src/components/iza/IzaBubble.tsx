import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface IzaBubbleProps {
  text: string;
  type: 'assistant' | 'user';
  timestamp: Date;
  isTyping?: boolean;
}

export const IzaBubble = ({ text, type, timestamp, isTyping = false }: IzaBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isTyping) {
      setDisplayedText('');
      setIsAnimating(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsAnimating(false);
        }
      }, 30); // Velocidade de digitação

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(text);
      setIsAnimating(false);
    }
  }, [text, isTyping]);

  const isAssistant = type === 'assistant';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
        marginBottom: 2,
        animation: 'bubble-appear 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '@keyframes bubble-appear': {
          '0%': {
            opacity: 0,
            transform: isAssistant
              ? 'translateX(-20px) scale(0.9)'
              : 'translateX(20px) scale(0.9)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0) scale(1)',
          },
        },
      }}
    >
      <Box
        sx={{
          maxWidth: '75%',
          padding: 2,
          borderRadius: isAssistant
            ? '20px 20px 20px 4px'
            : '20px 20px 4px 20px',
          backgroundColor: isAssistant ? '#FFFFFF' : '#E1007A',
          color: isAssistant ? '#1A1A1A' : '#FFFFFF',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          '&::before': isAssistant
            ? {
                content: '""',
                position: 'absolute',
                left: -8,
                bottom: 12,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '8px 8px 8px 0',
                borderColor: 'transparent #FFFFFF transparent transparent',
              }
            : {
                content: '""',
                position: 'absolute',
                right: -8,
                bottom: 12,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '8px 0 8px 8px',
                borderColor: 'transparent transparent transparent #E1007A',
              },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {displayedText}
          {isAnimating && isTyping && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 8,
                height: 16,
                backgroundColor: isAssistant ? '#005FDB' : '#FFFFFF',
                marginLeft: 1,
                animation: 'cursor-blink 1s infinite',
                verticalAlign: 'middle',
                '@keyframes cursor-blink': {
                  '0%, 50%': {
                    opacity: 1,
                  },
                  '51%, 100%': {
                    opacity: 0,
                  },
                },
              }}
            />
          )}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            marginTop: 1,
            opacity: 0.7,
            fontSize: '0.75rem',
          }}
        >
          {new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
    </Box>
  );
};

