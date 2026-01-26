import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useState, useRef, useEffect } from 'react';

export const VideoRecorder = () => {
  const { updateVideo } = useReport();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoPlaybackRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Timer de gravação
  useEffect(() => {
    if (isRecording) {
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
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });
      streamRef.current = stream;
      setHasPermission(true);

      // Exibir preview no vídeo
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp8,opus',
      };

      // Verificar suporte ao codec
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        // Criar arquivo e atualizar contexto
        const videoFile = new File([blob], `video-${Date.now()}.webm`, {
          type: 'video/webm',
        });

        updateVideo({
          file: videoFile,
          preview: url,
        });

        // Parar stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Limpar preview
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        setError('Erro durante a gravação de vídeo');
        console.error('MediaRecorder error:', event);
      };

      mediaRecorder.start(1000); // Coletar dados a cada segundo
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setHasPermission(false);
      console.error('Error accessing camera:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVideoEnded = () => {
    // Vídeo terminou de reproduzir
  };

  const deleteRecording = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setRecordingTime(0);
    updateVideo(null);
  };

  const reRecord = () => {
    deleteRecording();
    startRecording();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Gravação de Vídeo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {hasPermission === false && (
        <Alert severity="warning" sx={{ marginBottom: 2 }} role="alert">
          Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.
        </Alert>
      )}

      {!isRecording && !videoUrl && (
        <Button
          variant="contained"
          startIcon={<VideocamIcon />}
          onClick={startRecording}
          aria-label="Iniciar gravação de vídeo"
          fullWidth
          size="large"
          sx={{ marginBottom: 2 }}
        >
          Iniciar Gravação de Vídeo
        </Button>
      )}

      {isRecording && (
        <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
          <Box sx={{ position: 'relative', marginBottom: 2 }}>
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
                backgroundColor: '#000',
              }}
              aria-label="Preview da gravação de vídeo"
            />
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: 1,
                backgroundColor: 'error.main',
                color: 'error.contrastText',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={16} sx={{ color: 'inherit' }} />
              <Typography variant="body2" component="div" aria-live="polite">
                {formatTime(recordingTime)}
              </Typography>
            </Paper>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={stopRecording}
            aria-label="Parar gravação"
            fullWidth
          >
            Parar Gravação
          </Button>
        </Paper>
      )}

      {videoUrl && (
        <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Vídeo Gravado
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            <video
              ref={videoPlaybackRef}
              src={videoUrl}
              controls
              onEnded={handleVideoEnded}
              style={{
                width: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
                backgroundColor: '#000',
              }}
              aria-label="Preview do vídeo gravado"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Duração: {formatTime(recordingTime)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={reRecord}
              aria-label="Regravar vídeo"
            >
              Regravar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteRecording}
              aria-label="Excluir vídeo"
            >
              Excluir
            </Button>
          </Box>
        </Paper>
      )}

      <Alert severity="info" sx={{ marginTop: 2 }} role="note">
        <Typography variant="body2">
          Clique em "Iniciar Gravação de Vídeo" e permita o acesso à câmera e microfone quando solicitado.
          Você pode parar a gravação a qualquer momento.
        </Typography>
      </Alert>
    </Box>
  );
};

