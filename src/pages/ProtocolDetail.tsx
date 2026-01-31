import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ReportData } from '@/context/ReportContext';
import {
  getTrailForProtocol,
  saveTrailForProtocol,
  appendNextTrailEvent,
  getNextStage,
  createInitialTrail,
  type TrailEvent,
} from '@/utils/trailTracking';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageLayout, PageHeader } from '@/components/PageLayout';
import { ProtocolDisplay } from '@/components/ProtocolDisplay';
import { ProtocolTimeline } from '@/components/ProtocolTimeline';
import { Badge } from '@/components/ui/badge';
import { Printer, ArrowLeft, MapPin, FileText, Calendar, Sparkles } from 'lucide-react';
import { ROUTES } from '@/config';

interface StoredReport extends ReportData {
  id: string;
}

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

export function ProtocolDetail() {
  const { protocolId: protocolIdEncoded } = useParams<{ protocolId: string }>();
  const protocolId = protocolIdEncoded ? decodeURIComponent(protocolIdEncoded) : '';
  const navigate = useNavigate();
  const [report, setReport] = useState<StoredReport | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!protocolId) {
      setNotFound(true);
      return;
    }
    try {
      const stored = localStorage.getItem('participa_reports');
      if (!stored) {
        setNotFound(true);
        return;
      }
      const parsed: (StoredReport & { createdAt: string; updatedAt: string })[] = JSON.parse(stored);
      const found = parsed.find(
        (r) => r.protocol === protocolId || r.id === protocolId
      );
      if (!found) {
        setNotFound(true);
        return;
      }
      setReport({
        ...found,
        createdAt: new Date(found.createdAt),
        updatedAt: new Date(found.updatedAt),
      });
      let loadedTrail = getTrailForProtocol(protocolId);
      if (loadedTrail.length === 0) {
        loadedTrail = createInitialTrail(protocolId, {
          description: found.description,
          summary: found.summary,
          classification: found.classification,
        });
        saveTrailForProtocol(protocolId, loadedTrail);
      }
      setTrail(loadedTrail);
    } catch {
      setNotFound(true);
    }
  }, [protocolId]);

  const handleCopyProtocol = () => {
    if (report?.protocol) {
      navigator.clipboard.writeText(report.protocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    globalThis.print?.();
  };

  const handleSimulateNextStep = () => {
    if (!report?.protocol) return;
    const nextTrail = appendNextTrailEvent(report.protocol, trail, {
      description: report.description,
      summary: report.summary,
      classification: report.classification ?? undefined,
    });
    if (nextTrail.length === trail.length) return;
    saveTrailForProtocol(report.protocol, nextTrail);
    setTrail(nextTrail);
  };

  const canSimulateNextStep = getNextStage(trail) !== null;

  if (notFound || !protocolId) {
    return (
      <PageLayout maxWidth="page" padding="md">
        <PageHeader
          title="Protocolo não encontrado"
          description="O protocolo informado não existe ou não está disponível."
        />
        <Alert variant="destructive" className="mb-6" role="alert">
          <AlertDescription>
            Não foi possível localizar o registro com o protocolo &quot;{protocolId}&quot;.
            Verifique o número ou acesse Meus Registros para listar suas manifestações.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="gap-2">
          <Link to={ROUTES.MY_REPORTS}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para Meus Registros
          </Link>
        </Button>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout maxWidth="page" padding="md">
        <p className="text-muted-foreground">Carregando...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="prose" padding="lg">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(ROUTES.MY_REPORTS)}
        aria-label="Voltar para Meus Registros"
      >
        <ArrowLeft className="h-4 w-4" />
        Meus Registros
      </Button>

      <PageHeader
        title="Detalhes do protocolo"
        description="Informações completas do seu registro"
      />

      <Card className="mb-8 border-2 border-primary/20">
        <CardContent className="p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Número do protocolo
          </p>
          <ProtocolDisplay
            protocol={report.protocol}
            variant="block"
            showCopy
            onCopy={handleCopyProtocol}
            copied={copied}
            actions={
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrint}
                aria-label="Imprimir"
                className="h-10 w-10 shrink-0 bg-muted hover:bg-muted/80"
              >
                <Printer className="h-5 w-5 text-primary" />
              </Button>
            }
          />
          {copied && (
            <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              Protocolo copiado para a área de transferência.
            </p>
          )}
        </CardContent>
      </Card>

      <section className="mb-8" aria-labelledby="dados-heading">
        <h2 id="dados-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <FileText className="h-5 w-5 text-participa-blue" aria-hidden />
          Dados do registro
        </h2>
        <Card>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Descrição</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {report.description || 'Sem descrição'}
              </p>
            </div>

            {report.summary && (
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Resumo</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {report.summary}
                </p>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Identificação</h3>
              <p className="text-sm text-foreground">
                {report.identification.type === 'anonymous' ? 'Registro anônimo' : 'Registro identificado'}
              </p>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden />
                Datas
              </h3>
              <p className="text-sm text-foreground">
                <strong>Criado em:</strong> {formatDate(report.createdAt)}
                <br />
                <strong>Atualizado em:</strong> {formatDate(report.updatedAt)}
              </p>
            </div>

            {report.location && (
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden />
                  Localização
                </h3>
                <p className="text-sm text-foreground">
                  {report.location.address || `Lat: ${report.location.latitude}, Long: ${report.location.longitude}`}
                </p>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Anexos</h3>
              <div className="flex flex-wrap gap-2">
                {report.audio && <Badge variant="outline">Áudio</Badge>}
                {report.image && <Badge variant="outline">Imagem</Badge>}
                {report.video && <Badge variant="outline">Vídeo</Badge>}
                {!report.audio && !report.image && !report.video && (
                  <span className="text-sm text-muted-foreground">Nenhum anexo</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8" aria-labelledby="timeline-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="timeline-heading" className="text-lg font-semibold text-foreground">
            Trilhagem e acompanhamento
          </h2>
          {canSimulateNextStep && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSimulateNextStep}
              className="gap-1.5 text-participa-blue hover:bg-participa-blue/10"
              aria-label="Simular próxima etapa do protocolo (IA)"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Simular próxima etapa (IA)
            </Button>
          )}
        </div>
        <Card>
          <CardContent className="p-6 sm:p-8">
            <ProtocolTimeline trail={trail.length > 0 ? trail : undefined} />
          </CardContent>
        </Card>
      </section>

      <Alert variant="info" className="mb-8" role="note">
        <AlertDescription>
          Guarde este protocolo para acompanhar o andamento na seção &quot;Meus Registros&quot;.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link to={ROUTES.MY_REPORTS}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para Meus Registros
          </Link>
        </Button>
        <Button className="gap-2 bg-participa-blue hover:bg-participa-blue-dark" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>
    </PageLayout>
  );
}
