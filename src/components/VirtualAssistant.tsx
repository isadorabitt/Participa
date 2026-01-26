import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { IzaButton } from './iza/IzaButton';
import { IzaChat } from './iza/IzaChat';
import { playNotificationSound, playMessageSound } from '../utils/soundUtils';

interface Message {
  id: number;
  text: string;
  type: 'assistant' | 'user';
  timestamp: Date;
}

interface PageMessages {
  [key: string]: {
    welcome: string;
    help: string[];
    tips: string[];
  };
}

const pageMessages: PageMessages = {
  '/': {
    welcome: 'Olá! Eu sou a IZA, assistente virtual da Ouvidoria do Participa. Estou aqui para ajudá-lo a navegar pelo sistema e fazer seus registros de manifestação. Como posso ajudá-lo hoje?',
    help: [
      'No Participa, você pode criar um novo registro de ouvidoria clicando em "Novo Registro" no menu lateral.',
      'Para acompanhar seus registros na Ouvidoria do Participa, acesse "Meus Registros".',
      'Se tiver dúvidas sobre a Ouvidoria do Participa, consulte a seção "FAQ" ou "Orientações".',
    ],
    tips: [
      'Dica: A Ouvidoria do Participa oferece acessibilidade completa. Use o botão no topo para ajustar fonte e contraste.',
      'Dica: Na Ouvidoria do Participa, todos os registros podem ser feitos de forma anônima ou identificada.',
    ],
  },
  '/novo-registro': {
    welcome: 'Bem-vindo à criação de novo registro na Ouvidoria do Participa! Vou guiá-lo através do processo passo a passo.',
    help: [
      'Passo 1: Descreva detalhadamente o fato ocorrido. A Ouvidoria do Participa permite adicionar áudio, imagem ou vídeo como anexos.',
      'Passo 2: A localização é opcional na Ouvidoria do Participa, mas ajuda a identificar o local exato do ocorrido.',
      'Passo 3: Escolha se deseja fazer o registro anônimo ou identificado na Ouvidoria do Participa.',
      'Passo 4: Revise todas as informações antes de finalizar seu registro na Ouvidoria do Participa.',
      'Passo 5: Você receberá um protocolo único da Ouvidoria do Participa para acompanhar seu registro.',
    ],
    tips: [
      'Dica: A Ouvidoria do Participa permite gravar áudio descrevendo o fato, o que pode ser mais rápido que digitar.',
      'Dica: Se tiver fotos ou vídeos do ocorrido, adicione-os como anexos para enriquecer seu registro na Ouvidoria do Participa.',
    ],
  },
  '/meus-registros': {
    welcome: 'Aqui você pode visualizar e acompanhar todos os seus registros na Ouvidoria do Participa.',
    help: [
      'Use o protocolo recebido da Ouvidoria do Participa para buscar um registro específico.',
      'Na Ouvidoria do Participa, você pode filtrar registros por data, status ou tipo de manifestação.',
      'Cada registro da Ouvidoria do Participa mostra seu status atual e histórico de atualizações.',
    ],
    tips: [
      'Dica: Guarde sempre o protocolo do seu registro na Ouvidoria do Participa para consultas futuras.',
    ],
  },
  '/ouvidoria': {
    welcome: 'Esta seção explica o que é a Ouvidoria do Participa e como ela funciona.',
    help: [
      'A Ouvidoria do Participa é um canal de comunicação entre o cidadão e a instituição.',
      'Na Ouvidoria do Participa, você pode registrar reclamações, sugestões, elogios ou denúncias.',
      'Todos os registros na Ouvidoria do Participa são tratados com sigilo e confidencialidade.',
    ],
    tips: [
      'Dica: A Ouvidoria do Participa é um direito seu. Use-a para contribuir com a melhoria dos serviços públicos.',
    ],
  },
  '/orientacoes': {
    welcome: 'Aqui você encontra orientações sobre como usar a Ouvidoria do Participa.',
    help: [
      'Leia atentamente as orientações da Ouvidoria do Participa antes de fazer um registro.',
      'Se tiver dúvidas sobre a Ouvidoria do Participa, consulte o FAQ ou entre em contato.',
    ],
    tips: [
      'Dica: Quanto mais detalhado for seu registro na Ouvidoria do Participa, melhor será o atendimento.',
    ],
  },
  '/faq': {
    welcome: 'Perguntas frequentes sobre a Ouvidoria do Participa.',
    help: [
      'Navegue pelas perguntas mais comuns sobre a Ouvidoria do Participa para encontrar respostas rápidas.',
      'Se não encontrar sua dúvida sobre a Ouvidoria do Participa, você pode fazer um novo registro.',
    ],
    tips: [
      'Dica: Use a busca para encontrar perguntas específicas sobre a Ouvidoria do Participa rapidamente.',
    ],
  },
  '/acessibilidade': {
    welcome: 'Configurações de acessibilidade do sistema.',
    help: [
      'Aqui você pode ajustar o tamanho da fonte e ativar o alto contraste.',
      'Use os atalhos de teclado para navegação rápida.',
    ],
    tips: [
      'Dica: Alt + C para alternar alto contraste, Alt + + para aumentar fonte.',
    ],
  },
};

export const VirtualAssistant = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentHelpIndex, setCurrentHelpIndex] = useState(0);
  const [soundEnabled] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentPageMessages = pageMessages[location.pathname] || pageMessages['/'];

  useEffect(() => {
    if (isOpen && isEnabled && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: currentPageMessages.welcome,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      speakMessage(welcomeMessage.text);
    }
  }, [isOpen, isEnabled, location.pathname]);


  const speakMessage = (text: string) => {
    if (!isEnabled || !('speechSynthesis' in window)) {
      return;
    }

    // Cancelar fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    playNotificationSound(soundEnabled);
    
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: currentPageMessages.welcome,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      speakMessage(welcomeMessage.text);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    setIsOpen(false);
  };

  // Listener para evento de abrir IZA
  useEffect(() => {
    const handleOpenIza = () => {
      handleOpen();
    };

    window.addEventListener('open-iza-assistant', handleOpenIza);
    return () => {
      window.removeEventListener('open-iza-assistant', handleOpenIza);
    };
  }, [messages.length, currentPageMessages]);

  const handleToggleEnabled = () => {
    if (isEnabled) {
      stopSpeaking();
    }
    setIsEnabled(!isEnabled);
  };

  const handleHelp = () => {
    if (currentHelpIndex < currentPageMessages.help.length) {
      const helpText = currentPageMessages.help[currentHelpIndex];
      const newMessage: Message = {
        id: Date.now(),
        text: helpText,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      playMessageSound(soundEnabled);
      speakMessage(helpText);
      setCurrentHelpIndex((prev) => (prev + 1) % currentPageMessages.help.length);
    }
  };

  const handleTip = () => {
    const randomTip =
      currentPageMessages.tips[
        Math.floor(Math.random() * currentPageMessages.tips.length)
      ];
    const newMessage: Message = {
      id: Date.now(),
      text: randomTip,
      type: 'assistant',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    playMessageSound(soundEnabled);
    speakMessage(randomTip);
  };

  const handleRepeat = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'assistant') {
        speakMessage(lastMessage.text);
      }
    }
  };

  // Determinar se deve pulsar (quando há mensagens não lidas ou quando quer ajudar)
  const shouldPulse = !isOpen && messages.length > 0;
  const hasNotification = !isOpen && messages.length > 0;

  return (
    <>
      {/* Botão Flutuante com Animação */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
        }}
      >
        <IzaButton
          onClick={handleOpen}
          isPulsing={shouldPulse}
          hasNotification={hasNotification}
        />
      </Box>

      {/* Chat com Fade-in e Modo Reduzido */}
      <IzaChat
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isEnabled={isEnabled}
        onToggleEnabled={handleToggleEnabled}
        onHelp={handleHelp}
        onTip={handleTip}
        onRepeat={handleRepeat}
        isSpeaking={isSpeaking}
        title="IZA - Ouvidoria do Participa"
      />
    </>
  );
};

