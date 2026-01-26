/**
 * Utilitários para sons discretos da IZA
 */

let audioContext: AudioContext | null = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Toca um som discreto de notificação
 */
export const playNotificationSound = (enabled: boolean = true) => {
  if (!enabled) return;

  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Tom suave e discreto
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    // Volume baixo (0.1 = 10%)
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (error) {
    // Silenciosamente falhar se áudio não estiver disponível
    if (import.meta.env.DEV) {
      console.warn('Não foi possível reproduzir som:', error);
    }
  }
};

/**
 * Toca um som de mensagem recebida
 */
export const playMessageSound = (enabled: boolean = true) => {
  if (!enabled) return;

  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Tom mais agudo para mensagem
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Não foi possível reproduzir som:', error);
    }
  }
};

