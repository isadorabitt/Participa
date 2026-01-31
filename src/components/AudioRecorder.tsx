import { useReport } from '../context/ReportContext';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader } from './ui/card';
import { Mic, Pause, Square, Play, Trash2, RotateCcw, Loader2 } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioRecorder = () => {
  const { updateAudio } = useReport();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const audioFile = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        try {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            updateAudio({ file: audioFile, dataUrl: reader.result as string });
          };
          reader.onerror = () => updateAudio({ file: audioFile });
        } catch {
          updateAudio({ file: audioFile });
        }
      };

      mediaRecorder.onerror = () => setError('Erro durante a gravação de áudio');
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
    } catch {
      setError('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
    updateAudio(null);
  };

  const reRecord = () => {
    deleteRecording();
    startRecording();
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 text-lg font-semibold">Gravação de Áudio</h3>

      {error && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isRecording && !audioUrl && (
        <Button
          className="mb-4 w-full"
          size="lg"
          onClick={startRecording}
          aria-label="Iniciar gravação de áudio"
        >
          <Mic className="h-5 w-5" />
          Iniciar Gravação
        </Button>
      )}

      {isRecording && (
        <Card className="mb-4 border-destructive bg-destructive/10 text-destructive">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
              <span className="text-lg font-semibold" role="timer" aria-live="polite">
                {formatTime(recordingTime)}
              </span>
            </div>
            <div className="flex gap-1">
              {isPaused ? (
                <Button variant="ghost" size="icon" onClick={resumeRecording} aria-label="Retomar gravação">
                  <Play className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={pauseRecording} aria-label="Pausar gravação">
                  <Pause className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={stopRecording} aria-label="Parar gravação">
                <Square className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {audioUrl && (
        <Card className="mb-4">
          <CardHeader>
            <h4 className="text-base font-medium">Áudio Gravado</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} aria-label="Preview do áudio gravado" />
              <Button variant="default" size="icon" onClick={playAudio} aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}>
                <Play className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground">Duração: {formatTime(recordingTime)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reRecord} aria-label="Regravar áudio">
                <RotateCcw className="h-4 w-4" />
                Regravar
              </Button>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={deleteRecording} aria-label="Excluir áudio">
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert variant="info" className="mt-4" role="note">
        <AlertDescription>
          Clique em &quot;Iniciar Gravação&quot; e permita o acesso ao microfone quando solicitado.
          Você pode pausar, retomar ou parar a gravação a qualquer momento.
        </AlertDescription>
      </Alert>
    </div>
  );
};
