import { useReport } from '../context/ReportContext';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader } from './ui/card';
import { Video, Square, Trash2, RotateCcw, Loader2, Upload } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const VideoRecorder = () => {
  const { updateVideo } = useReport();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [displayDuration, setDisplayDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoPlaybackRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      setHasPermission(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      const options: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp8,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) options.mimeType = 'video/webm';
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data?.size > 0) chunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setDisplayDuration(recordingTime);
        updateVideo({ file: new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' }), preview: url });
        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
      };
      mediaRecorder.onerror = () => setError('Erro durante a gravação de vídeo');
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
    } catch {
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setRecordingTime(0);
    setDisplayDuration(0);
    updateVideo(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    setError(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setDisplayDuration(0);
    updateVideo({ file, preview: url });
    event.target.value = '';
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const duration = Math.floor(e.currentTarget.duration);
    if (Number.isFinite(duration)) setDisplayDuration(duration);
  };

  const reRecord = () => {
    deleteRecording();
    startRecording();
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 text-lg font-semibold">Gravação de Vídeo</h3>

      {error && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasPermission === false && (
        <Alert variant="warning" className="mb-4" role="alert">
          <AlertDescription>
            Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.
          </AlertDescription>
        </Alert>
      )}

      {!isRecording && !videoUrl && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="sr-only"
            aria-label="Selecionar vídeo do dispositivo"
          />
          <Button className="flex-1" size="lg" onClick={startRecording} aria-label="Iniciar gravação de vídeo">
            <Video className="h-5 w-5" />
            Gravar vídeo
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Enviar vídeo do dispositivo"
          >
            <Upload className="h-5 w-5" />
            Subir vídeo
          </Button>
        </div>
      )}

      {isRecording && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full max-h-[400px] rounded-lg bg-black"
                aria-label="Preview da gravação de vídeo"
              />
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-destructive px-3 py-1.5 text-destructive-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span className="text-sm font-medium" role="timer" aria-live="polite">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
            <Button className="w-full bg-destructive hover:bg-destructive/90" onClick={stopRecording} aria-label="Parar gravação">
              <Square className="h-5 w-5" />
              Parar Gravação
            </Button>
          </CardContent>
        </Card>
      )}

      {videoUrl && (
        <Card className="mb-4">
          <CardHeader>
            <h4 className="text-base font-medium">Vídeo Gravado</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <video
              ref={videoPlaybackRef}
              src={videoUrl}
              controls
              onLoadedMetadata={handleVideoLoadedMetadata}
              className="w-full max-h-[400px] rounded-lg bg-black"
              aria-label="Preview do vídeo"
            />
            {displayDuration > 0 && (
              <p className="text-sm text-muted-foreground">Duração: {formatTime(displayDuration)}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={reRecord} aria-label="Regravar vídeo">
                <RotateCcw className="h-4 w-4" />
                Regravar
              </Button>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={deleteRecording} aria-label="Excluir vídeo">
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert variant="info" className="mt-4" role="note">
        <AlertDescription>
          Grave um vídeo pela câmera (permita câmera e microfone quando solicitado) ou envie um vídeo do seu dispositivo com &quot;Subir vídeo&quot;.
        </AlertDescription>
      </Alert>
    </div>
  );
};
