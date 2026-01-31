import { useReport } from '../context/ReportContext';
import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent } from './ui/card';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  enableCompression?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
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
            resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
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

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const ImageUploader = ({
  enableCompression = true,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploaderProps) => {
  const { report, updateImage } = useReport();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`Formato não suportado. Use: ${acceptedFormats.map((f) => f.split('/')[1]).join(', ')}`);
      }
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      }
      let finalFile = file;
      if (enableCompression && fileSizeMB > 1) {
        finalFile = await compressImage(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(finalFile);
      reader.onload = (e) => {
        updateImage({ file: finalFile, preview: e.target?.result as string });
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error('Erro ao criar preview da imagem');
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
      setIsUploading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    updateImage(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 text-lg font-semibold">Upload de Imagem</h3>

      {error && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!report.image && (
        <Card className="border-2 border-dashed border-border bg-muted/30 p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Selecionar imagem"
          />
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden />
          <p className="mb-2 font-medium">Clique para fazer upload de uma imagem</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Formatos aceitos: {acceptedFormats.map((f) => f.split('/')[1]).join(', ')}
            <br />
            Tamanho máximo: {maxSizeMB}MB
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Fazer upload de imagem"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            {isUploading ? 'Processando...' : 'Selecionar Imagem'}
          </Button>
        </Card>
      )}

      {report.image && (
        <Card>
          <CardContent className="flex gap-4 p-4">
            <img
              src={report.image.preview}
              alt="Preview da imagem"
              className="max-h-[200px] max-w-[200px] rounded-lg border border-border object-contain"
            />
            <div className="flex-1">
              <h4 className="font-medium">{report.image.file.name}</h4>
              <p className="text-sm text-muted-foreground">Tamanho: {formatFileSize(report.image.file.size)}</p>
              <p className="text-sm text-muted-foreground">Tipo: {report.image.file.type}</p>
              <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:bg-destructive/10" onClick={handleRemove} aria-label="Remover imagem">
                <Trash2 className="h-4 w-4" />
                Remover
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert variant="info" className="mt-4" role="note">
        <AlertDescription>
          {enableCompression
            ? 'Imagens grandes serão comprimidas automaticamente para otimizar o upload.'
            : 'Certifique-se de que a imagem não exceda o tamanho máximo permitido.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};
