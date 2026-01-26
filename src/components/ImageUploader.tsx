import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useState, useRef } from 'react';

interface ImageUploaderProps {
  enableCompression?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export const ImageUploader = ({
  enableCompression = true,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploaderProps) => {
  const { report, updateImage } = useReport();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível criar contexto do canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Erro ao comprimir imagem'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validar formato
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(
          `Formato não suportado. Use: ${acceptedFormats.map((f) => f.split('/')[1]).join(', ')}`
        );
      }

      // Validar tamanho
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      }

      // Comprimir se habilitado
      let finalFile = file;
      if (enableCompression && fileSizeMB > 1) {
        finalFile = await compressImage(file);
      }

      // Criar preview
      const reader = new FileReader();
      reader.readAsDataURL(finalFile);
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        updateImage({
          file: finalFile,
          preview: preview,
        });
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error('Erro ao criar preview da imagem');
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
      setIsUploading(false);
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (report.image?.preview) {
      URL.revokeObjectURL(report.image.preview);
    }
    updateImage(null);
    setError(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upload de Imagem
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {!report.image && (
        <Paper
          elevation={2}
          sx={{
            padding: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            backgroundColor: 'action.hover',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            aria-label="Selecionar imagem"
          />
          <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', marginBottom: 2 }} />
          <Typography variant="body1" gutterBottom>
            Clique para fazer upload de uma imagem
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Formatos aceitos: {acceptedFormats.map((f) => f.split('/')[1]).join(', ')}
            <br />
            Tamanho máximo: {maxSizeMB}MB
          </Typography>
          <Button
            variant="contained"
            startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            onClick={handleButtonClick}
            disabled={isUploading}
            aria-label="Fazer upload de imagem"
          >
            {isUploading ? 'Processando...' : 'Selecionar Imagem'}
          </Button>
        </Paper>
      )}

      {report.image && (
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              component="img"
              src={report.image.preview}
              alt="Preview da imagem"
              sx={{
                maxWidth: 200,
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {report.image.file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tamanho: {formatFileSize(report.image.file.size)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo: {report.image.file.type}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <IconButton
                  color="error"
                  onClick={handleRemove}
                  aria-label="Remover imagem"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant="caption" component="span" sx={{ marginLeft: 1 }}>
                  Remover
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      <Alert severity="info" sx={{ marginTop: 2 }} role="note">
        <Typography variant="body2">
          {enableCompression
            ? 'Imagens grandes serão comprimidas automaticamente para otimizar o upload.'
            : 'Certifique-se de que a imagem não exceda o tamanho máximo permitido.'}
        </Typography>
      </Alert>
    </Box>
  );
};

