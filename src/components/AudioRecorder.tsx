import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useState, useRef, useEffect } from 'react';

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

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Timer de gravação
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Criar arquivo e atualizar contexto
        const audioFile = new File([blob], `audio-${Date.now()}.webm`, {
          type: 'audio/webm',
        });

        // Converter para base64
        try {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            const dataUrl = reader.result as string;
            updateAudio({
              file: audioFile,
              dataUrl: dataUrl,
            });
          };
          reader.onerror = () => {
            // Se falhar a conversão, ainda salva o arquivo
            updateAudio({
              file: audioFile,
            });
          };
        } catch (err) {
          // Se falhar a conversão, ainda salva o arquivo
          updateAudio({
            file: audioFile,
          });
        }
      };

      mediaRecorder.onerror = (event) => {
        setError('Erro durante a gravação de áudio');
        console.error('MediaRecorder error:', event);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
    } catch (err) {
      setError('Não foi possível acessar o microfone. Verifique as permissões.');
      console.error('Error accessing microphone:', err);
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
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

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    updateAudio(null);
  };

  const reRecord = () => {
    deleteRecording();
    startRecording();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Gravação de Áudio
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {!isRecording && !audioUrl && (
        <Button
          variant="contained"
          startIcon={<MicIcon />}
          onClick={startRecording}
          aria-label="Iniciar gravação de áudio"
          fullWidth
          size="large"
          sx={{ marginBottom: 2 }}
        >
          Iniciar Gravação
        </Button>
      )}

      {isRecording && (
        <Paper
          elevation={2}
          sx={{
            padding: 3,
            marginBottom: 2,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
              <Typography variant="h6" component="div" aria-live="polite">
                {formatTime(recordingTime)}
              </Typography>
            </Box>
            <Box>
              {isPaused ? (
                <IconButton
                  onClick={resumeRecording}
                  aria-label="Retomar gravação"
                  sx={{ color: 'inherit' }}
                >
                  <PlayArrowIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={pauseRecording}
                  aria-label="Pausar gravação"
                  sx={{ color: 'inherit' }}
                >
                  <PauseIcon />
                </IconButton>
              )}
              <IconButton
                onClick={stopRecording}
                aria-label="Parar gravação"
                sx={{ color: 'inherit' }}
              >
                <StopIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}

      {audioUrl && (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Áudio Gravado
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              aria-label="Preview do áudio gravado"
            />
            <IconButton
              onClick={playAudio}
              aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
              color="primary"
              size="large"
            >
              <PlayArrowIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Duração: {formatTime(recordingTime)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={reRecord}
              aria-label="Regravar áudio"
            >
              Regravar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteRecording}
              aria-label="Excluir áudio"
            >
              Excluir
            </Button>
          </Box>
        </Paper>
      )}

      <Alert severity="info" sx={{ marginTop: 2 }} role="note">
        <Typography variant="body2">
          Clique em "Iniciar Gravação" e permita o acesso ao microfone quando solicitado.
          Você pode pausar, retomar ou parar a gravação a qualquer momento.
        </Typography>
      </Alert>
    </Box>
  );
};

