import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Collapse,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  HelpOutline as HelpOutlineIcon,
  Lightbulb as LightbulbIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { IzaBubble } from './IzaBubble';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  type: 'assistant' | 'user';
  timestamp: Date;
}

interface IzaChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isEnabled: boolean;
  onToggleEnabled: () => void;
  onHelp: () => void;
  onTip?: () => void;
  onRepeat?: () => void;
  isSpeaking?: boolean;
  title?: string;
}

export const IzaChat = ({
  isOpen,
  onClose,
  messages,
  isEnabled,
  onToggleEnabled,
  onHelp,
  onTip,
  onRepeat,
  isSpeaking = false,
  title = 'IZA - Ouvidoria do Participa',
}: IzaChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setIsMinimized(false);
    }
  }, [messages, isOpen]);

  if (!isOpen && isMinimized) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 100 },
          right: { xs: 8, sm: 24 },
          width: 200,
          borderRadius: 3,
          overflow: 'hidden',
          cursor: 'pointer',
          animation: 'minimized-appear 0.3s ease-out',
          '@keyframes minimized-appear': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px) scale(0.9)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
        onClick={() => setIsMinimized(false)}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #E1007A 0%, #B80062 100%)',
            color: 'white',
            padding: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              width: 32,
              height: 32,
            }}
          >
            IZ
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
          {messages.length > 0 && (
            <Chip
              label={messages.length}
              size="small"
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontWeight: 600,
                minWidth: 24,
                height: 20,
              }}
            />
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 100 },
          right: { xs: 8, sm: 24 },
          left: { xs: 8, sm: 'auto' },
          width: { xs: 'calc(100vw - 16px)', sm: 380 },
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: 'calc(100vh - 140px)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          animation: 'chat-fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes chat-fade-in': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px) scale(0.95)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
        role="dialog"
        aria-labelledby="iza-chat-title"
        aria-describedby="iza-chat-messages"
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #E1007A 0%, #B80062 100%)',
            color: 'white',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0px 2px 8px rgba(225, 0, 122, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                width: 40,
                height: 40,
              }}
            >
              IZ
            </Avatar>
            <Box>
              <Typography
                id="iza-chat-title"
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: '1rem' }}
              >
                {title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                {isEnabled ? 'Ativa' : 'Inativa'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={onToggleEnabled}
              aria-label={isEnabled ? 'Desativar áudio' : 'Ativar áudio'}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {isEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={onHelp}
              aria-label="Ajuda"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setIsMinimized(true);
                onClose();
              }}
              aria-label="Minimizar chat"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Mensagens */}
        <Box
          id="iza-chat-messages"
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: 2,
            backgroundColor: '#F4F5F7',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D1D3D6',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#B9BCC2',
              },
            },
          }}
        >
          {messages.map((message, index) => (
            <IzaBubble
              key={message.id}
              text={message.text}
              type={message.type}
              timestamp={message.timestamp}
              isTyping={index === messages.length - 1 && message.type === 'assistant'}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Controles */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<HelpOutlineIcon />}
              onClick={onHelp}
              disabled={!isEnabled}
              aria-label="Solicitar ajuda"
              sx={{ flex: 1, minWidth: '120px' }}
            >
              Ajuda
            </Button>
            {onTip && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<LightbulbIcon />}
                onClick={onTip}
                disabled={!isEnabled}
                aria-label="Solicitar dica"
                sx={{ flex: 1, minWidth: '120px' }}
              >
                Dica
              </Button>
            )}
            {onRepeat && (
              <IconButton
                onClick={onRepeat}
                disabled={!isEnabled || messages.length === 0 || isSpeaking}
                aria-label="Repetir última mensagem"
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {isSpeaking ? <VolumeOffIcon /> : <RepeatIcon />}
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Chip
              label={isEnabled ? 'Ativado' : 'Desativado'}
              color={isEnabled ? 'success' : 'default'}
              size="small"
            />
            <Button
              variant="text"
              size="small"
              onClick={onToggleEnabled}
              aria-label={isEnabled ? 'Desativar assistente' : 'Ativar assistente'}
            >
              {isEnabled ? 'Desativar' : 'Ativar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
};

