import {
  Button } from '../ui/button';
import { IzaBubble } from './IzaBubble';
import { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, HelpCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsMinimized(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsMinimized(false)}
        className="fixed bottom-20 right-6 z-[1001] w-[200px] cursor-pointer overflow-hidden rounded-xl bg-card shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:bottom-24"
      >
        <div className="flex items-center gap-2 bg-gradient-to-br from-participa-pink to-participa-pink-dark px-4 py-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
            IZ
          </div>
          <span className="flex-1 text-sm font-semibold">{title}</span>
          {messages.length > 0 && (
            <span className="flex h-5 min-w-[24px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-semibold text-black">
              {messages.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="iza-chat-title"
      aria-describedby="iza-chat-messages"
      className="fixed bottom-20 right-6 left-6 z-[1001] flex max-h-[calc(100vh-140px)] w-[calc(100vw-32px)] max-w-[380px] flex-col overflow-hidden rounded-xl bg-card shadow-lg animate-in fade-in slide-in-from-bottom-4 sm:left-auto sm:right-6"
    >
      <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-participa-pink to-participa-pink-dark px-4 py-3 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            IZ
          </div>
          <div>
            <h2 id="iza-chat-title" className="text-base font-semibold">
              {title}
            </h2>
            <p className="text-xs text-white">{isEnabled ? 'Ativa' : 'Inativa'}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleEnabled}
            aria-label={isEnabled ? 'Desativar áudio' : 'Ativar áudio'}
            className="text-white hover:bg-white/10"
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onHelp}
            aria-label="Ajuda"
            className="text-white hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsMinimized(true);
              onClose();
            }}
            aria-label="Minimizar chat"
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id="iza-chat-messages"
        className="flex-1 overflow-y-auto bg-muted p-4 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar]:w-2"
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
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onHelp}
            disabled={!isEnabled}
            aria-label="Solicitar ajuda"
            className="min-w-[120px] flex-1"
          >
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </Button>
          {onTip && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTip}
              disabled={!isEnabled}
              aria-label="Solicitar dica"
              className="min-w-[120px] flex-1"
            >
              <Lightbulb className="h-4 w-4" />
              Dica
            </Button>
          )}
          {onRepeat && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRepeat}
              disabled={!isEnabled || messages.length === 0 || isSpeaking}
              aria-label="Repetir última mensagem"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              isEnabled ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
            )}
          >
            {isEnabled ? 'Ativado' : 'Desativado'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEnabled}
            aria-label={isEnabled ? 'Desativar assistente' : 'Ativar assistente'}
          >
            {isEnabled ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
