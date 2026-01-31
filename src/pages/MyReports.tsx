import { useAccessibility } from '../context/AccessibilityContext';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ReportData } from '../context/ReportContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PageLayout, PageHeader } from '../components/PageLayout';
import { Badge } from '../components/ui/badge';
import { ProtocolDisplay } from '../components/ProtocolDisplay';
import { Check, FileEdit, Search, Copy, Eye, Trash2, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoredReport extends ReportData {
  id: string;
}

type TabKind = 'enviadas' | 'rascunhos';

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

export const MyReports = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [draftsCount, setDraftsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabKind>('enviadas');
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('participa_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        setReports(
          parsed.map((r: StoredReport & { createdAt: string; updatedAt: string }) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          }))
        );
      }
      const drafts = localStorage.getItem('participa_drafts');
      setDraftsCount(drafts ? (JSON.parse(drafts) as unknown[]).length : 0);
    } catch {
      if (import.meta.env.DEV) console.error('Erro ao carregar registros');
    }
  }, []);

  const filteredReports = useMemo(() => {
    let result = reports;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.protocol.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          (r.summary?.toLowerCase().includes(term))
      );
    }
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reports, searchTerm]);

  const handleCopyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  const handleDeleteReport = (id: string) => {
    if (globalThis.confirm('Tem certeza que deseja excluir este registro?')) {
      const updated = reports.filter((r) => r.id !== id);
      localStorage.setItem('participa_reports', JSON.stringify(updated));
      setReports(updated);
      }
  };

  const textStyle = { fontSize: `${fontSize}px` } as React.CSSProperties;

  const showEmpty =
    (activeTab === 'enviadas' && filteredReports.length === 0) ||
    (activeTab === 'rascunhos' && draftsCount === 0);

  const renderListContent = () => {
    if (showEmpty) {
      return (
        <Card className={cn('py-14 text-center', highContrast && 'border-white bg-black')}>
          <CardContent className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Check className="h-8 w-8 text-muted-foreground" aria-hidden />
            </div>
            <h2 className="mb-2 font-semibold text-foreground" style={{ fontSize: `calc(${fontSize}px * 1.25)` }}>
              Nenhuma manifestação encontrada
            </h2>
            <p className="mb-6 max-w-md text-muted-foreground" style={textStyle}>
              Faça login para ver seu histórico ou busque por um protocolo acima.
            </p>
            <Button
              asChild
              className="gap-2 rounded-lg bg-participa-blue font-semibold text-white hover:bg-participa-blue-dark"
            >
              <Link to="/">
                Acessar
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }
    if (activeTab === 'rascunhos') {
      return (
        <div id="panel-rascunhos" role="tabpanel" aria-labelledby="tab-rascunhos">
          <Card className={cn(highContrast && 'border-white bg-black')}>
            <CardContent className="py-10 text-center text-muted-foreground" style={textStyle}>
              Lista de rascunhos em breve.
            </CardContent>
          </Card>
        </div>
      );
    }
    if (filteredReports.length === 0) {
      return (
        <Alert variant="info">
          <AlertDescription style={textStyle}>
            Nenhum registro encontrado com os filtros aplicados.
          </AlertDescription>
        </Alert>
      );
    }
    return (
      <div id="panel-enviadas" role="tabpanel" aria-labelledby="tab-enviadas" className="flex flex-col gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className={cn(highContrast && 'border-white bg-black')}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <ProtocolDisplay protocol={report.protocol} variant="compact" showCopy={false} />
                </div>
                <p className="text-sm text-muted-foreground" style={textStyle}>
                  Criado em {formatDate(report.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyProtocol(report.protocol)}
                  aria-label="Copiar protocolo"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label="Ver detalhes do registro"
                >
                  <Link to={`/protocolo/${encodeURIComponent(report.protocol)}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteReport(report.id)}
                  aria-label="Excluir registro"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <p className="mb-4 line-clamp-2 text-sm" style={textStyle}>
                {report.description || 'Sem descrição'}
              </p>
              <div className="flex flex-wrap gap-2">
                {report.audio && <Badge variant="outline">Áudio</Badge>}
                {report.image && <Badge variant="outline">Imagem</Badge>}
                {report.video && <Badge variant="outline">Vídeo</Badge>}
                {report.location && <Badge variant="outline">Localização</Badge>}
                <Badge variant="secondary">
                  {report.identification.type === 'anonymous' ? 'Anônimo' : 'Identificado'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <PageLayout maxWidth="page" padding="md">
      <PageHeader
        title="Consultar Manifestações"
        description="Acompanhe suas manifestações enviadas ou consulte protocolos"
      />

      <div className="mb-6 border-b border-border">
        <div className="flex gap-6" role="tablist" aria-label="Abas Enviadas e Rascunhos">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'enviadas'}
            aria-controls="panel-enviadas"
            id="tab-enviadas"
            className={cn(
              'flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2',
              activeTab === 'enviadas'
                ? 'border-participa-blue text-participa-blue'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTab('enviadas')}
          >
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            Enviadas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rascunhos'}
            aria-controls="panel-rascunhos"
            id="tab-rascunhos"
            className={cn(
              'flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-participa-blue focus-visible:ring-offset-2',
              activeTab === 'rascunhos'
                ? 'border-participa-blue text-participa-blue'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTab('rascunhos')}
          >
            <FileEdit className="h-4 w-4 shrink-0" aria-hidden />
            Rascunhos {draftsCount > 0 && `(${draftsCount})`}
          </button>
        </div>
      </div>

      {copiedProtocol && (
        <p role="status" aria-live="polite" className="mb-4 text-sm text-green-600 dark:text-green-400">
          Protocolo copiado para a área de transferência.
        </p>
      )}

      <div className="mb-8 flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por protocolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-11"
            style={textStyle}
            aria-label="Buscar por protocolo"
          />
        </div>
        <Button
          type="button"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-lg bg-participa-blue hover:bg-participa-blue-dark"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>

      {renderListContent()}
    </PageLayout>
  );
};
