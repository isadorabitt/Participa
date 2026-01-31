import { useReport } from '../context/ReportContext';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { FieldTutorial } from './FieldTutorial';
import { FileText, Mic, Image as ImageIcon, Video, MapPin, User } from 'lucide-react';

const CLASSIFICATION_VARIANT: Record<string, 'success' | 'destructive' | 'default' | 'warning' | 'info'> = {
  Elogio: 'success',
  Reclamação: 'destructive',
  Denúncia: 'destructive',
  Solicitação: 'default',
  Sugestão: 'warning',
  Informação: 'info',
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const Summary = () => {
  const { report, generateSummary } = useReport();

  useEffect(() => {
    generateSummary();
  }, [
    report.description,
    report.audio,
    report.image,
    report.video,
    report.location,
    report.identification,
  ]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-xl font-semibold">Resumo do Registro</h2>
        <FieldTutorial
          title="Resumo"
          description="Confira descrição, anexos, localização e identificação. Se algo estiver errado, volte nos passos anteriores. Ao clicar em Finalizar, seu registro será enviado e você receberá um protocolo."
          izaContextId="novo-registro-resumo"
        />
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Revise todas as informações antes de finalizar o registro.
      </p>

      <Card className="mb-4">
        <CardContent className="flex items-center gap-2 pt-6">
          <FileText className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="text-lg font-semibold">Descrição</h3>
        </CardContent>
        <CardContent className="pt-0">
          <p className="whitespace-pre-wrap text-sm">{report.description || 'Nenhuma descrição fornecida'}</p>
          {report.classification && report.classification.confianca > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Classificação Automática:</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={CLASSIFICATION_VARIANT[report.classification.tipo] ?? 'default'}>
                  {report.classification.tipo}
                </Badge>
                <span className="text-sm text-muted-foreground">{report.classification.confianca}% de confiança</span>
              </div>
              {report.classification.tags && report.classification.tags.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-xs text-muted-foreground">Tags identificadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {report.classification.tags.slice(0, 5).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">Anexos</h3>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-0">
          {report.audio && (
            <Badge variant="secondary" className="gap-1">
              <Mic className="h-3 w-3" /> Áudio
            </Badge>
          )}
          {report.image && (
            <Badge variant="secondary" className="gap-1">
              <ImageIcon className="h-3 w-3" /> Imagem: {report.image.file.name}
            </Badge>
          )}
          {report.video && (
            <Badge variant="secondary" className="gap-1">
              <Video className="h-3 w-3" /> Vídeo: {report.video.file.name}
            </Badge>
          )}
          {!report.audio && !report.image && !report.video && (
            <p className="text-sm text-muted-foreground">Nenhum anexo adicionado</p>
          )}
        </CardContent>
      </Card>

      {report.location && (
        <Card className="mb-4">
          <CardContent className="flex items-start gap-2 pt-6">
            <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="font-semibold">Localização</h3>
              {report.location.address && (
                <p className="text-sm">
                  <strong>Endereço:</strong> {report.location.address}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                <strong>Coordenadas:</strong> {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent className="flex items-start gap-2 pt-6">
          <User className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h3 className="font-semibold">Identificação</h3>
            {report.identification.type === 'anonymous' ? (
              <Badge variant="secondary">Anônimo</Badge>
            ) : (
              <div className="text-sm">
                <p><strong>Tipo:</strong> Identificado</p>
                {report.identification.name && <p><strong>Nome:</strong> {report.identification.name}</p>}
                {report.identification.email && <p><strong>Email:</strong> {report.identification.email}</p>}
                {report.identification.phone && <p><strong>Telefone:</strong> {report.identification.phone}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">Resumo Automático</h3>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground pt-0">
          {report.summary || 'Gerando resumo...'}
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground"><strong>Criado em:</strong> {formatDate(report.createdAt)}</p>
        <p className="text-xs text-muted-foreground"><strong>Última atualização:</strong> {formatDate(report.updatedAt)}</p>
      </div>

      <Alert variant="warning" className="mt-6" role="alert">
        <AlertDescription>
          Após finalizar, você receberá um protocolo de registro. Anote ou salve esse protocolo para acompanhar o andamento do seu registro.
        </AlertDescription>
      </Alert>
    </div>
  );
};
