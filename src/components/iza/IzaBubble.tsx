import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface IzaBubbleProps {
  text: string;
  type: 'assistant' | 'user';
  timestamp: Date;
  isTyping?: boolean;
}

export const IzaBubble = ({
  text,
  type,
  timestamp,
  isTyping = false,
}: IzaBubbleProps) => {
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
      }, 30);
      return () => clearInterval(typingInterval);
    }
    setDisplayedText(text);
    setIsAnimating(false);
  }, [text, isTyping]);

  const isAssistant = type === 'assistant';

  return (
    <div
      className={cn(
        'mb-4 flex animate-[bubble-appear_0.4s_cubic-bezier(0.4,0,0.2,1)]',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'relative max-w-[75%] rounded-2xl px-4 py-3 shadow-md',
          isAssistant
            ? 'rounded-bl-md bg-white text-foreground'
            : 'rounded-br-md bg-participa-pink text-white'
        )}
      >
        <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed">
          {displayedText}
          {isAnimating && isTyping && (
            <span
              className="ml-1 inline-block h-4 w-2 animate-pulse align-middle"
              style={{
                backgroundColor: isAssistant ? '#005FDB' : '#fff',
              }}
              aria-hidden
            />
          )}
        </p>
        <p className="mt-2 block text-xs text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
