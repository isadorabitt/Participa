import { Button } from '../ui/button';
import { Bot } from 'lucide-react';

interface IzaButtonProps {
  onClick: () => void;
  isPulsing?: boolean;
  hasNotification?: boolean;
}

export const IzaButton = ({
  onClick,
  isPulsing = false,
  hasNotification = false,
}: IzaButtonProps) => (
  <div className="relative inline-block">
    {isPulsing && (
      <span
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-participa-pink opacity-30 animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        aria-hidden
      />
    )}
    {hasNotification && (
      <span
        className="absolute right-2 top-2 z-10 h-3 w-3 rounded-full border-2 border-white bg-amber-400 animate-[notification-blink_1.5s_ease-in-out_infinite]"
        aria-hidden
      />
    )}
    <Button
      type="button"
      size="icon-lg"
      onClick={onClick}
      aria-label="Abrir assistente virtual IZA"
      className="relative h-16 w-16 rounded-full bg-participa-pink shadow-lg hover:bg-participa-pink-dark hover:scale-110 hover:shadow-xl active:scale-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-participa-pink focus-visible:outline-offset-2"
      style={
        isPulsing
          ? { animation: 'button-float 3s ease-in-out infinite' }
          : undefined
      }
    >
      <Bot className="h-8 w-8" />
    </Button>
  </div>
);
