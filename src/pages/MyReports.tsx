import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';
import { useState, useEffect, useMemo } from 'react';
import type { ReportData } from '../context/ReportContext';

interface StoredReport extends ReportData {
  id: string;
}

export const MyReports = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<StoredReport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recent' | 'old'>('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const stored = localStorage.getItem('participa_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter strings de data para objetos Date
        const reportsWithDates = parsed.map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt),
        }));
        setReports(reportsWithDates);
      }
    } catch (error) {
      // Erro ao carregar - não crítico, apenas log em desenvolvimento
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar registros:', error);
      }
    }
  };

  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.protocol.toLowerCase().includes(term) ||
          report.description.toLowerCase().includes(term) ||
          report.summary.toLowerCase().includes(term)
      );
    }

    // Filtro por data
    if (filter === 'recent') {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === 'old') {
      filtered = filtered.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return filtered;
  }, [reports, searchTerm, filter]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const handleViewReport = (report: StoredReport) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleCopyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      const updated = reports.filter((r) => r.id !== id);
      localStorage.setItem('participa_reports', JSON.stringify(updated));
      setReports(updated);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: `calc(${fontSize}px * 2)` }}
        >
          Meus Registros
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: `${fontSize}px` }}
        >
          Visualize e acompanhe todos os seus registros
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por protocolo ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ marginRight: 1, color: 'text.secondary' }} />
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 250,
            '& .MuiInputBase-input': {
              fontSize: `${fontSize}px`,
            },
          }}
          aria-label="Buscar registros"
        />
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilter('all')}
          startIcon={<FilterListIcon />}
          sx={{ fontSize: `${fontSize}px` }}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'recent' ? 'contained' : 'outlined'}
          onClick={() => setFilter('recent')}
          sx={{ fontSize: `${fontSize}px` }}
        >
          Mais Recentes
        </Button>
        <Button
          variant={filter === 'old' ? 'contained' : 'outlined'}
          onClick={() => setFilter('old')}
          sx={{ fontSize: `${fontSize}px` }}
        >
          Mais Antigos
        </Button>
      </Box>

      {reports.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            padding: 6,
            textAlign: 'center',
            backgroundColor: highContrast ? '#000' : 'background.paper',
          }}
        >
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', marginBottom: 2 }} />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: `calc(${fontSize}px * 1.5)` }}
          >
            Nenhum registro encontrado
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: `${fontSize}px`, marginBottom: 3 }}
          >
            Você ainda não criou nenhum registro. Crie seu primeiro registro na seção 
            "Novo Registro".
          </Typography>
          <Button
            variant="contained"
            href="/novo-registro"
            sx={{ fontSize: `${fontSize}px` }}
          >
            Criar Novo Registro
          </Button>
        </Paper>
      ) : filteredReports.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: `${fontSize}px` }}>
          <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
            Nenhum registro encontrado com os filtros aplicados.
          </Typography>
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              elevation={2}
              sx={{
                backgroundColor: highContrast ? '#000' : 'background.paper',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 2,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
                    >
                      Protocolo: {report.protocol}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: `${fontSize}px` }}
                    >
                      Criado em: {formatDate(report.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Copiar protocolo">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyProtocol(report.protocol)}
                        aria-label="Copiar protocolo"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleViewReport(report)}
                        aria-label="Visualizar registro"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReport(report.id)}
                        aria-label="Excluir registro"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: `${fontSize}px`,
                    marginBottom: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {report.description || 'Sem descrição'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {report.audio && (
                    <Chip label="Áudio" size="small" color="primary" variant="outlined" />
                  )}
                  {report.image && (
                    <Chip label="Imagem" size="small" color="primary" variant="outlined" />
                  )}
                  {report.video && (
                    <Chip label="Vídeo" size="small" color="primary" variant="outlined" />
                  )}
                  {report.location && (
                    <Chip label="Localização" size="small" color="primary" variant="outlined" />
                  )}
                  <Chip
                    label={report.identification.type === 'anonymous' ? 'Anônimo' : 'Identificado'}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog de Visualização */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="report-dialog-title"
      >
        {selectedReport && (
          <>
            <DialogTitle id="report-dialog-title">
              <Typography variant="h6" sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}>
                Protocolo: {selectedReport.protocol}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: `${fontSize}px` }}
                  >
                    Descrição
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: `${fontSize}px`, whiteSpace: 'pre-wrap' }}
                  >
                    {selectedReport.description}
                  </Typography>
                </Box>

                {selectedReport.summary && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: `${fontSize}px` }}
                    >
                      Resumo
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: `${fontSize}px`, whiteSpace: 'pre-wrap' }}
                    >
                      {selectedReport.summary}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: `${fontSize}px` }}
                  >
                    Informações
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
                    <strong>Criado em:</strong> {formatDate(selectedReport.createdAt)}
                    <br />
                    <strong>Atualizado em:</strong> {formatDate(selectedReport.updatedAt)}
                    <br />
                    <strong>Identificação:</strong>{' '}
                    {selectedReport.identification.type === 'anonymous'
                      ? 'Anônimo'
                      : 'Identificado'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={{ fontSize: `${fontSize}px` }}
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

