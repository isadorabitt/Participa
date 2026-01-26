import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useReport } from '../context/ReportContext';
import { useState, useEffect } from 'react';
import { ProtocolTimeline } from './ProtocolTimeline';

export const Protocol = () => {
  const { report, generateProtocol, clearReport } = useReport();
  const [copied, setCopied] = useState(false);

  // Garantir que o protocolo foi gerado e salvar no localStorage
  useEffect(() => {
    if (!report.protocol) {
      generateProtocol();
    } else {
      // Salvar registro no localStorage
      try {
        const stored = localStorage.getItem('participa_reports');
        const reports = stored ? JSON.parse(stored) : [];
        
        // Verificar se já existe (evitar duplicatas)
        const exists = reports.some((r: any) => r.protocol === report.protocol);
        if (!exists) {
          const reportToSave = {
            ...report,
            id: report.protocol, // Usar protocolo como ID
            createdAt: report.createdAt.toISOString(),
            updatedAt: report.updatedAt.toISOString(),
          };
          reports.push(reportToSave);
          localStorage.setItem('participa_reports', JSON.stringify(reports));
        }
      } catch (error) {
        // Erro ao salvar - não crítico, apenas log em desenvolvimento
        if (import.meta.env.DEV) {
          console.error('Erro ao salvar registro:', error);
        }
      }
    }
  }, [report.protocol, generateProtocol]);

  const handleCopyProtocol = () => {
    if (report.protocol) {
      navigator.clipboard.writeText(report.protocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewReport = () => {
    clearReport();
    // Usar navigate do react-router em vez de window.location
    window.location.href = '/novo-registro';
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center', paddingY: { xs: 3, sm: 5 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 3,
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 64, color: '#2E7D32' }}
            aria-hidden="true"
          />
        </Box>
      </Box>

      <Typography 
        variant="h3" 
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: 2,
          fontSize: { xs: '1.75rem', sm: '2.25rem' },
        }}
      >
        Agradeço o seu contato
      </Typography>

      <Typography 
        variant="h6" 
        color="text.secondary" 
        paragraph
        sx={{
          fontWeight: 400,
          color: '#6B7280',
          marginBottom: 4,
          fontSize: { xs: '1rem', sm: '1.125rem' },
        }}
      >
        O registro foi realizado com sucesso. Até breve!
      </Typography>

      <Paper
        elevation={0}
        sx={{
          padding: { xs: 3, sm: 4 },
          marginY: 4,
          backgroundColor: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: 3,
          maxWidth: 600,
          marginX: 'auto',
        }}
      >
        <Typography 
          variant="overline" 
          sx={{ 
            color: '#6B7280',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Protocolo de Registro
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            marginY: 2,
            wordBreak: 'break-word',
            color: '#005FDB',
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
          aria-label={`Protocolo: ${report.protocol}`}
        >
          {report.protocol}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1.5, 
            marginTop: 3,
            paddingTop: 2,
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <IconButton
            onClick={handleCopyProtocol}
            aria-label="Copiar protocolo"
            sx={{ 
              color: '#005FDB',
              backgroundColor: '#F3F4F6',
              '&:hover': {
                backgroundColor: '#E5E7EB',
              },
            }}
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton
            onClick={handlePrint}
            aria-label="Imprimir protocolo"
            sx={{ 
              color: '#005FDB',
              backgroundColor: '#F3F4F6',
              '&:hover': {
                backgroundColor: '#E5E7EB',
              },
            }}
          >
            <PrintIcon />
          </IconButton>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ marginBottom: 3, maxWidth: 600, marginX: 'auto' }}>
        <Typography variant="body2">
          <strong>Importante:</strong> Guarde este protocolo. Você precisará dele para 
          acompanhar o andamento do seu registro na seção "Meus Registros".
        </Typography>
      </Alert>

      {/* Timeline Visual */}
      <Box sx={{ maxWidth: 1200, marginX: 'auto', marginY: 4 }}>
        <ProtocolTimeline />
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          maxWidth: 500, 
          marginX: 'auto',
          marginTop: 4,
        }}
      >
        <Button
          variant="contained"
          onClick={handleNewReport}
          fullWidth
          size="large"
          aria-label="Criar novo registro"
          sx={{
            backgroundColor: '#2E7D32',
            fontWeight: 600,
            paddingY: 1.5,
            '&:hover': {
              backgroundColor: '#1B5E20',
            },
          }}
        >
          Criar Novo Registro
        </Button>
        <Button
          variant="outlined"
          href="/meus-registros"
          fullWidth
          size="large"
          aria-label="Ver meus registros"
          sx={{
            borderColor: '#005FDB',
            color: '#005FDB',
            fontWeight: 600,
            paddingY: 1.5,
            '&:hover': {
              borderColor: '#0048A8',
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          Ver Meus Registros
        </Button>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        message="Protocolo copiado para a área de transferência!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

