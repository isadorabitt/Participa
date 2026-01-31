import { useReport } from '../context/ReportContext';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createInitialTrail, saveTrailForProtocol } from '../utils/trailTracking';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent } from './ui/card';
import { ProtocolDisplay } from './ProtocolDisplay';
import { ProtocolTimeline } from './ProtocolTimeline';
import { CheckCircle2, Printer } from 'lucide-react';
export const Protocol = () => {
  const { report, generateProtocol, clearReport } = useReport();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!report.protocol) {
      generateProtocol();
    } else {
      try {
        const stored = localStorage.getItem('participa_reports');
        const reports = stored ? JSON.parse(stored) : [];
        const exists = reports.some((r: { protocol?: string }) => r.protocol === report.protocol);
        if (!exists) {
          const reportToSave = {
            ...report,
            id: report.protocol,
            createdAt: report.createdAt.toISOString(),
            updatedAt: report.updatedAt.toISOString(),
          };
          reports.push(reportToSave);
          localStorage.setItem('participa_reports', JSON.stringify(reports));
          const initialTrail = createInitialTrail(report.protocol, {
            description: report.description,
            summary: report.summary,
            classification: report.classification,
          });
          saveTrailForProtocol(report.protocol, initialTrail);
        }
      } catch {
        if (import.meta.env.DEV) console.error('Erro ao salvar registro');
      }
    }
  }, [report.protocol, generateProtocol, report]);

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
    navigate('/novo-registro');
  };

  const SECTION_SPACING = 'mb-10';
  return (
    <div className="mx-auto w-full max-w-2xl py-8 text-center md:py-12">
      <div className={`flex justify-center ${SECTION_SPACING}`}>
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 md:h-[120px] md:w-[120px]">
          <CheckCircle2 className="h-12 w-12 text-green-700 md:h-16 md:w-16" aria-hidden />
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
        Agradeço o seu contato
      </h1>
      <p className={`text-base text-muted-foreground md:text-lg ${SECTION_SPACING}`}>
        O registro foi realizado com sucesso. Até breve!
      </p>

      <Card className={`mx-auto max-w-[480px] border border-border ${SECTION_SPACING}`}>
        <CardContent className="py-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Protocolo de Registro
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
                aria-label="Imprimir protocolo"
                className="h-10 w-10 shrink-0 bg-muted hover:bg-muted/80"
              >
                <Printer className="h-5 w-5 text-primary" />
              </Button>
            }
          />
        </CardContent>
      </Card>

      {copied && (
        <p
          role="status"
          className="mb-4 text-sm text-muted-foreground"
          aria-live="polite"
        >
          Protocolo copiado para a área de transferência!
        </p>
      )}

      <Alert variant="info" className={`mx-auto max-w-[480px] ${SECTION_SPACING}`}>
        <AlertDescription className="py-1">
          <strong>Importante:</strong> Guarde este protocolo. Você precisará dele para
          acompanhar o andamento do seu registro na seção &quot;Meus Registros&quot;.
        </AlertDescription>
      </Alert>

      <div className={`mx-auto w-full ${SECTION_SPACING}`}>
        <ProtocolTimeline />
      </div>

      <div className="mx-auto flex max-w-[480px] flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button
          size="lg"
          className="w-full rounded-lg bg-green-700 hover:bg-green-800 sm:w-auto"
          onClick={handleNewReport}
          aria-label="Criar novo registro"
        >
          Criar Novo Registro
        </Button>
        {report.protocol && (
          <Button size="lg" variant="outline" className="w-full rounded-lg sm:w-auto" asChild>
            <Link to={`/protocolo/${encodeURIComponent(report.protocol)}`} aria-label="Ver detalhes do protocolo">
              Ver detalhes do protocolo
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-lg border-primary text-primary hover:bg-primary/10 sm:w-auto"
          onClick={() => navigate('/meus-registros')}
          aria-label="Ver meus registros"
        >
          Ver Meus Registros
        </Button>
      </div>
    </div>
  );
};
