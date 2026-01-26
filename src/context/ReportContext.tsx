import { createContext, useContext, useState, type ReactNode, useCallback, useRef, useEffect } from 'react';
import { generateProtocol as generateProtocolUtil } from '../utils/generateProtocol';
import { summarizeText } from '../utils/summarizeText';
import { classificarTexto, type ResultadoClassificacao } from '../utils/classificarTexto';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}

export interface VideoFile {
  file: File;
  preview: string;
}

export interface AudioFile {
  file: File;
  dataUrl?: string; // Base64 ou Blob convertido
}

export interface Identification {
  type: 'anonymous' | 'identified';
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
}

export interface ReportData {
  description: string;
  audio: AudioFile | null;
  image: ImageFile | null;
  video: VideoFile | null;
  location: Location | null;
  identification: Identification;
  summary: string;
  protocol: string;
  classification: ResultadoClassificacao | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportContextType {
  report: ReportData;
  updateDescription: (description: string) => void;
  updateAudio: (audio: AudioFile | null) => void;
  updateImage: (image: ImageFile | null) => void;
  updateVideo: (video: VideoFile | null) => void;
  updateLocation: (location: Location | null) => void;
  updateIdentification: (identification: Identification) => void;
  generateSummary: () => void;
  generateProtocol: () => void;
  clearReport: () => void;
  prepareForSubmission: () => FormData;
  updateField: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
  classifyManifestation: () => ResultadoClassificacao | null;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const initialReport: ReportData = {
  description: '',
  audio: null,
  image: null,
  video: null,
  location: null,
  identification: {
    type: 'anonymous',
  },
  summary: '',
  protocol: '',
  classification: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Função para converter File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Função para criar preview de imagem
const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Função para criar preview de vídeo
const createVideoPreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [report, setReport] = useState<ReportData>(initialReport);
  const reportRef = useRef<ReportData>(report);

  // Manter ref atualizada
  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  const updateDescription = useCallback((description: string) => {
    setReport((prev) => ({
      ...prev,
      description,
      updatedAt: new Date(),
    }));
  }, []);

  const updateAudio = useCallback(async (audio: AudioFile | null) => {
    if (audio && !audio.dataUrl) {
      try {
        const dataUrl = await fileToBase64(audio.file);
        audio.dataUrl = dataUrl;
      } catch (error) {
        // Erro ao converter - não crítico
        if (import.meta.env.DEV) {
          console.error('Erro ao converter áudio para base64:', error);
        }
      }
    }
    setReport((prev) => ({
      ...prev,
      audio,
      updatedAt: new Date(),
    }));
  }, []);

  const updateImage = useCallback(async (image: ImageFile | null) => {
    if (image && !image.preview) {
      try {
        const preview = await createImagePreview(image.file);
        image.preview = preview;
      } catch (error) {
        // Erro ao criar preview - não crítico
        if (import.meta.env.DEV) {
          console.error('Erro ao criar preview da imagem:', error);
        }
      }
    }
    setReport((prev) => ({
      ...prev,
      image,
      updatedAt: new Date(),
    }));
  }, []);

  const updateVideo = useCallback(async (video: VideoFile | null) => {
    if (video && !video.preview) {
      try {
        const preview = await createVideoPreview(video.file);
        video.preview = preview;
      } catch (error) {
        // Erro ao criar preview - não crítico
        if (import.meta.env.DEV) {
          console.error('Erro ao criar preview do vídeo:', error);
        }
      }
    }
    setReport((prev) => ({
      ...prev,
      video,
      updatedAt: new Date(),
    }));
  }, []);

  const updateLocation = useCallback((location: Location | null) => {
    setReport((prev) => ({
      ...prev,
      location,
      updatedAt: new Date(),
    }));
  }, []);

  const updateIdentification = useCallback((identification: Identification) => {
    setReport((prev) => ({
      ...prev,
      identification,
      updatedAt: new Date(),
    }));
  }, []);

  const generateSummary = useCallback(() => {
    setReport((prev) => {
      const parts: string[] = [];

      if (prev.description) {
        // Usar summarizeText para resumir a descrição se for muito longa
        const descriptionSummary = prev.description.length > 200
          ? summarizeText(prev.description, 200)
          : prev.description;
        parts.push(`Descrição: ${descriptionSummary}`);
      }

      if (prev.audio) {
        parts.push('Anexo: Áudio');
      }

      if (prev.image) {
        parts.push('Anexo: Imagem');
      }

      if (prev.video) {
        parts.push('Anexo: Vídeo');
      }

      if (prev.location) {
        const loc = prev.location;
        parts.push(
          `Localização: ${loc.address || `Lat: ${loc.latitude}, Lng: ${loc.longitude}`}`
        );
      }

      if (prev.identification.type === 'identified') {
        const ident = prev.identification;
        const identParts: string[] = [];
        if (ident.name) identParts.push(`Nome: ${ident.name}`);
        if (ident.email) identParts.push(`Email: ${ident.email}`);
        if (ident.phone) identParts.push(`Telefone: ${ident.phone}`);
        if (ident.cpf) identParts.push(`CPF: ${ident.cpf}`);
        if (identParts.length > 0) {
          parts.push(`Identificação: ${identParts.join(', ')}`);
        }
      } else {
        parts.push('Identificação: Anônima');
      }

      const fullSummary = parts.length > 0 ? parts.join('\n') : 'Nenhuma informação disponível';
      
      // Aplicar summarizeText no resumo completo se necessário
      const summary = fullSummary.length > 500
        ? summarizeText(fullSummary, 500)
        : fullSummary;

      return {
        ...prev,
        summary,
        updatedAt: new Date(),
      };
    });
  }, []);

  const generateProtocol = useCallback(() => {
    setReport((prev) => {
      if (!prev.protocol) {
        const protocol = generateProtocolUtil();
        return {
          ...prev,
          protocol,
          updatedAt: new Date(),
        };
      }
      return prev;
    });
  }, []);

  const clearReport = useCallback(() => {
    setReport((prev) => {
      // Limpar previews de imagem e vídeo
      if (prev.image?.preview) {
        URL.revokeObjectURL(prev.image.preview);
      }
      if (prev.video?.preview) {
        URL.revokeObjectURL(prev.video.preview);
      }

      return {
        ...initialReport,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }, []);

  const updateField = useCallback(<K extends keyof ReportData>(
    field: K,
    value: ReportData[K]
  ) => {
    setReport((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  }, []);

  const prepareForSubmission = useCallback((): FormData => {
    const formData = new FormData();
    const currentReport = reportRef.current;

    // Descrição
    formData.append('description', currentReport.description);

    // Áudio
    if (currentReport.audio) {
      formData.append('audio', currentReport.audio.file);
      if (currentReport.audio.dataUrl) {
        formData.append('audioDataUrl', currentReport.audio.dataUrl);
      }
    }

    // Imagem
    if (currentReport.image) {
      formData.append('image', currentReport.image.file);
      if (currentReport.image.preview) {
        formData.append('imagePreview', currentReport.image.preview);
      }
    }

    // Vídeo
    if (currentReport.video) {
      formData.append('video', currentReport.video.file);
      if (currentReport.video.preview) {
        formData.append('videoPreview', currentReport.video.preview);
      }
    }

    // Localização
    if (currentReport.location) {
      formData.append('location', JSON.stringify(currentReport.location));
    }

    // Identificação
    formData.append('identification', JSON.stringify(currentReport.identification));

    // Resumo
    formData.append('summary', currentReport.summary);

    // Protocolo
    if (currentReport.protocol) {
      formData.append('protocol', currentReport.protocol);
    }

    // Metadados
    formData.append('createdAt', currentReport.createdAt.toISOString());
    formData.append('updatedAt', currentReport.updatedAt.toISOString());

    return formData;
  }, []);

  const classifyManifestation = useCallback((): ResultadoClassificacao | null => {
    const currentReport = reportRef.current;
    if (!currentReport.description || currentReport.description.trim().length < 10) {
      return null;
    }

    const resultado = classificarTexto(currentReport.description);
    
    // Atualizar o report com a classificação
    setReport((prev) => ({
      ...prev,
      classification: resultado,
      updatedAt: new Date(),
    }));

    return resultado;
  }, []);

  // Classificar automaticamente quando a descrição mudar
  useEffect(() => {
    if (report.description && report.description.trim().length >= 10) {
      const resultado = classificarTexto(report.description);
      setReport((prev) => ({
        ...prev,
        classification: resultado,
      }));
    } else {
      setReport((prev) => ({
        ...prev,
        classification: null,
      }));
    }
  }, [report.description]);

  const value: ReportContextType = {
    report,
    updateDescription,
    updateAudio,
    updateImage,
    updateVideo,
    updateLocation,
    updateIdentification,
    generateSummary,
    generateProtocol,
    clearReport,
    prepareForSubmission,
    updateField,
    classifyManifestation,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport deve ser usado dentro de um ReportProvider');
  }
  return context;
};

