import { Box, Typography, Divider } from '@mui/material';
import { TextInput } from './TextInput';
import { AudioRecorder } from './AudioRecorder';
import { ImageUploader } from './ImageUploader';
import { VideoRecorder } from './VideoRecorder';

export const Attachments = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" paragraph>
        Forneça uma descrição detalhada do seu registro e, se desejar, adicione anexos de áudio, 
        imagem ou vídeo para complementar a informação.
      </Typography>

      <Box sx={{ marginBottom: 4 }}>
        <TextInput
          label="Descrição do Registro"
          maxLength={5000}
          minLength={10}
          required={true}
        />
      </Box>

      <Divider sx={{ marginY: 4 }} />

      <Box sx={{ marginBottom: 4 }}>
        <AudioRecorder />
      </Box>

      <Divider sx={{ marginY: 4 }} />

      <Box sx={{ marginBottom: 4 }}>
        <ImageUploader />
      </Box>

      <Divider sx={{ marginY: 4 }} />

      <Box sx={{ marginBottom: 4 }}>
        <VideoRecorder />
      </Box>
    </Box>
  );
};

