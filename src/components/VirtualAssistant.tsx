import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { IzaButton } from './iza/IzaButton';
import { IzaChat } from './iza/IzaChat';
import { IZA_CONTEXT_EVENT, type IzaContextId } from './FieldTutorial';
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

const fieldContextMessages: Record<IzaContextId, string> = {
  'novo-registro-descricao':
    'Aqui você descreve o fato com suas palavras. Use o botão "Ver exemplo de descrição" ou "Usar modelo sugerido pela IZA" para preencher um modelo e só trocar o que está entre colchetes. Inclua data, local e o que aconteceu. Evite CPF, cartão ou dados sensíveis.',
  'novo-registro-anexos':
    'Os anexos são opcionais. Você pode gravar um áudio descrevendo o fato, enviar uma foto ou um vídeo. Isso complementa a descrição escrita e ajuda no atendimento.',
  'novo-registro-localizacao':
    'A localização é opcional. Se quiser, use "Usar minha localização" para enviar onde você está, ou digite um endereço. Isso ajuda a direcionar sua manifestação ao setor responsável pela região.',
  'novo-registro-identificacao':
    'Escolha entre registro anônimo (sem identificar quem enviou) ou identificado (com nome e contato). Em ambos os casos você receberá um protocolo para acompanhar.',
  'novo-registro-resumo':
    'Revise a descrição, anexos, localização e identificação. Se estiver tudo certo, clique em "Finalizar" para enviar. Você receberá um protocolo para acompanhar o andamento.',
};

export const VirtualAssistant = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentHelpIndex, setCurrentHelpIndex] = useState(0);
  const [pendingContextId, setPendingContextId] = useState<IzaContextId | null>(null);
  const [soundEnabled] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentPageMessages = pageMessages[location.pathname] || pageMessages['/'];

  useEffect(() => {
    if (
      isOpen &&
      isEnabled &&
      messages.length === 0 &&
      !pendingContextId
    ) {
      const welcomeMessage: Message = {
        id: 1,
        text: currentPageMessages.welcome,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      speakMessage(welcomeMessage.text);
    }
  }, [isOpen, isEnabled, location.pathname, pendingContextId]);


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

  useEffect(() => {
    const handleOpenIza = () => {
      handleOpen();
    };

    const handleOpenWithContext = (e: Event) => {
      const detail = (e as CustomEvent<{ contextId: IzaContextId }>).detail;
      if (detail?.contextId && fieldContextMessages[detail.contextId]) {
        setPendingContextId(detail.contextId);
        setIsOpen(true);
        playNotificationSound(soundEnabled);
      }
    };

    globalThis.addEventListener('open-iza-assistant', handleOpenIza);
    globalThis.addEventListener(IZA_CONTEXT_EVENT, handleOpenWithContext);
    return () => {
      globalThis.removeEventListener('open-iza-assistant', handleOpenIza);
      globalThis.removeEventListener(IZA_CONTEXT_EVENT, handleOpenWithContext);
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (!isOpen || !pendingContextId) return;
    const text = fieldContextMessages[pendingContextId];
    if (!text) {
      setPendingContextId(null);
      return;
    }
    const contextMessage: Message = {
      id: Date.now(),
      text,
      type: 'assistant',
      timestamp: new Date(),
    };
    setMessages((prev) => {
      const hasWelcome = prev.some((m) => m.type === 'assistant');
      if (hasWelcome) return [...prev, contextMessage];
      const welcome: Message = {
        id: 1,
        text: currentPageMessages.welcome,
        type: 'assistant',
        timestamp: new Date(),
      };
      return [welcome, contextMessage];
    });
    speakMessage(text);
    setPendingContextId(null);
  }, [isOpen, pendingContextId, currentPageMessages.welcome]);

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
      <div className="fixed bottom-4 right-4 z-[1000] sm:bottom-6 sm:right-6">
        <IzaButton
          onClick={handleOpen}
          isPulsing={shouldPulse}
          hasNotification={hasNotification}
        />
      </div>

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

