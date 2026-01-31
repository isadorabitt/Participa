import { useAccessibility } from '../context/AccessibilityContext';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PageLayout, PageHeader } from '../components/PageLayout';
import { Info, Shield, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const MANIFESTATION_TYPES = [
  {
    id: 'reclamacao',
    title: 'Reclamação',
    content:
      'Manifestação sobre insatisfação com serviço prestado, atendimento recebido ou situação vivenciada. A reclamação é analisada e encaminhada ao setor responsável para apuração e resposta.',
  },
  {
    id: 'sugestao',
    title: 'Sugestão',
    content:
      'Proposta de melhoria para serviços, processos ou políticas. Suas sugestões são analisadas e podem ser implementadas para aprimorar os serviços oferecidos.',
  },
  {
    id: 'elogio',
    title: 'Elogio',
    content:
      'Reconhecimento positivo sobre serviço prestado ou atendimento recebido. Os elogios são compartilhados com as equipes responsáveis e contribuem para a valorização do trabalho realizado.',
  },
  {
    id: 'denuncia',
    title: 'Denúncia',
    content:
      'Comunicação sobre irregularidade, ilegalidade ou conduta inadequada. As denúncias são tratadas com sigilo e encaminhadas aos órgãos competentes para apuração.',
  },
  {
    id: 'solicitacao',
    title: 'Solicitação de Informação',
    content:
      'Pedido de informações sobre serviços, processos ou políticas. As solicitações são respondidas de acordo com a Lei de Acesso à Informação.',
  },
] as const;

export const About = () => {
  const { fontSize, highContrast } = useAccessibility();
  const textStyle = { fontSize: `${fontSize}px`, lineHeight: 1.8 } as React.CSSProperties;
  const headingStyle = { fontSize: `calc(${fontSize}px * 1.5)` } as React.CSSProperties;

  return (
    <PageLayout maxWidth="page" padding="md">
      <PageHeader
        title="O que é Ouvidoria"
        description="Entenda o papel da ouvidoria e como ela pode ajudá-lo"
      />

      <Card className={cn('mb-6', highContrast && 'border-white bg-black')}>
        <CardContent className="flex gap-4 pt-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <Info className="h-8 w-8 text-participa-blue" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 font-semibold" style={headingStyle}>
              Definição
            </h2>
            <p className="mb-4" style={textStyle}>
              A ouvidoria é um canal de comunicação entre o cidadão e a instituição, criado para receber, analisar e encaminhar manifestações da sociedade. É um instrumento democrático que permite a participação cidadã na gestão pública e na melhoria dos serviços oferecidos.
            </p>
            <p style={textStyle}>
              Através da ouvidoria, você pode registrar reclamações, sugestões, elogios, denúncias e solicitações de informação, contribuindo para a transparência e o controle social.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="mb-6 font-semibold" style={headingStyle}>
          Tipos de Manifestação
        </h2>
        <div className="space-y-2">
          {MANIFESTATION_TYPES.map((item) => (
            <details key={item.id} className="group rounded-lg border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-semibold focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <span style={{ fontSize: `calc(${fontSize}px * 1.2)` }}>{item.title}</span>
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="border-t border-border px-4 py-3">
                <p style={textStyle}>{item.content}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <Card className={cn('mb-6', highContrast && 'border-white bg-black')}>
        <CardContent className="flex gap-4 pt-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <Shield className="h-8 w-8 text-participa-blue" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 font-semibold" style={headingStyle}>
              Sigilo e Confidencialidade
            </h2>
            <p className="mb-4" style={textStyle}>
              Todas as manifestações são tratadas com absoluto sigilo e confidencialidade. Seus dados pessoais são protegidos conforme a legislação vigente sobre proteção de dados pessoais.
            </p>
            <p style={textStyle}>
              Você pode fazer registros de forma anônima ou identificada, conforme sua preferência. Em ambos os casos, seu registro será processado e você receberá um protocolo para acompanhamento.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={cn('mb-6', highContrast && 'border-white bg-black')}>
        <CardContent className="flex gap-4 pt-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <Clock className="h-8 w-8 text-participa-blue" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 font-semibold" style={headingStyle}>
              Prazos de Resposta
            </h2>
            <p className="mb-4" style={textStyle}>
              Os registros são analisados e respondidos dentro dos prazos estabelecidos pela legislação. Você pode acompanhar o andamento do seu registro através do protocolo recebido.
            </p>
            <ul className="list-inside list-disc space-y-2 pl-2" style={textStyle}>
              <li><strong>Reclamações e Denúncias:</strong> Até 30 dias (podendo ser prorrogado por mais 30 dias)</li>
              <li><strong>Solicitações de Informação:</strong> Até 20 dias (podendo ser prorrogado por mais 10 dias)</li>
              <li><strong>Sugestões e Elogios:</strong> Análise e encaminhamento conforme disponibilidade</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert variant="info" role="note">
        <AlertDescription style={textStyle}>
          <strong>Importante:</strong> A ouvidoria é um canal de participação cidadã. Use este espaço para contribuir com a melhoria dos serviços e a transparência da gestão pública.
        </AlertDescription>
      </Alert>
    </PageLayout>
  );
};
