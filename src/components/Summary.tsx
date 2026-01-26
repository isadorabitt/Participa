import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useEffect } from 'react';

export const Summary = () => {
  const { report, generateSummary } = useReport();

  useEffect(() => {
    generateSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    report.description,
    report.audio,
    report.image,
    report.video,
    report.location,
    report.identification,
  ]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Resumo do Registro
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Revise todas as informações antes de finalizar o registro.
      </Typography>

      <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6">Descrição</Typography>
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', marginBottom: 2 }}>
          {report.description || 'Nenhuma descrição fornecida'}
        </Typography>
        
        {report.classification && report.classification.confianca > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1 }}>
              Classificação Automática:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Chip
                label={report.classification.tipo}
                size="medium"
                color={
                  report.classification.tipo === 'Elogio'
                    ? 'success'
                    : report.classification.tipo === 'Reclamação' || report.classification.tipo === 'Denúncia'
                    ? 'error'
                    : report.classification.tipo === 'Solicitação'
                    ? 'primary'
                    : report.classification.tipo === 'Sugestão'
                    ? 'warning'
                    : 'info'
                }
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                {report.classification.confianca}% de confiança
              </Typography>
            </Box>
            {report.classification.tags && report.classification.tags.length > 0 && (
              <Box sx={{ marginTop: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginBottom: 0.5 }}>
                  Tags identificadas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {report.classification.tags.slice(0, 5).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Anexos
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {report.audio && (
            <Chip
              icon={<MicIcon />}
              label="Áudio"
              color="primary"
              variant="outlined"
            />
          )}
          {report.image && (
            <Chip
              icon={<ImageIcon />}
              label={`Imagem: ${report.image.file.name}`}
              color="primary"
              variant="outlined"
            />
          )}
          {report.video && (
            <Chip
              icon={<VideocamIcon />}
              label={`Vídeo: ${report.video.file.name}`}
              color="primary"
              variant="outlined"
            />
          )}
          {!report.audio && !report.image && !report.video && (
            <Typography variant="body2" color="text.secondary">
              Nenhum anexo adicionado
            </Typography>
          )}
        </Box>
      </Paper>

      {report.location && (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
            <LocationOnIcon color="primary" />
            <Typography variant="h6">Localização</Typography>
          </Box>
          {report.location.address && (
            <Typography variant="body1" paragraph>
              <strong>Endereço:</strong> {report.location.address}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            <strong>Coordenadas:</strong> {report.location.latitude.toFixed(6)},{' '}
            {report.location.longitude.toFixed(6)}
          </Typography>
        </Paper>
      )}

      <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6">Identificação</Typography>
        </Box>
        <Typography variant="body1">
          {report.identification.type === 'anonymous' ? (
            <Chip label="Anônimo" color="secondary" size="small" />
          ) : (
            <Box>
              <Typography variant="body2">
                <strong>Tipo:</strong> Identificado
              </Typography>
              {report.identification.name && (
                <Typography variant="body2">
                  <strong>Nome:</strong> {report.identification.name}
                </Typography>
              )}
              {report.identification.email && (
                <Typography variant="body2">
                  <strong>Email:</strong> {report.identification.email}
                </Typography>
              )}
              {report.identification.phone && (
                <Typography variant="body2">
                  <strong>Telefone:</strong> {report.identification.phone}
                </Typography>
              )}
            </Box>
          )}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Resumo Automático
        </Typography>
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}
        >
          {report.summary || 'Gerando resumo...'}
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ padding: 2, backgroundColor: 'action.hover' }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Criado em:</strong> {formatDate(report.createdAt)}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          <strong>Última atualização:</strong> {formatDate(report.updatedAt)}
        </Typography>
      </Paper>

      <Alert severity="warning" sx={{ marginTop: 3 }} role="alert">
        <Typography variant="body2">
          Após finalizar, você receberá um protocolo de registro. Anote ou salve esse protocolo 
          para acompanhar o andamento do seu registro.
        </Typography>
      </Alert>
    </Box>
  );
};

