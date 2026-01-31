import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { PageLayout, PageHeader } from '../components/PageLayout';
import { FileText, MapPin, User, Eye, ClipboardList, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    label: 'Descreva o Fato',
    description: 'Forneça uma descrição detalhada e objetiva',
    icon: FileText,
    content: [
      'Seja claro e objetivo na descrição do fato ocorrido',
      'Informe data, horário e local quando possível',
      'Mencione todas as pessoas envolvidas (sem dados pessoais sensíveis)',
      'Descreva o que aconteceu de forma cronológica',
      'Evite incluir dados pessoais como CPF, números de cartão ou senhas',
    ],
  },
  {
    label: 'Adicione Anexos (Opcional)',
    description: 'Enriqueça seu registro com mídias',
    icon: MapPin,
    content: [
      'Você pode adicionar áudio, imagem ou vídeo como anexos',
      'Áudio: útil para descrever verbalmente o ocorrido',
      'Imagem: fotos que comprovem ou ilustrem o fato',
      'Vídeo: gravações do ocorrido ou situação relacionada',
      'Certifique-se de que os anexos sejam relevantes ao registro',
    ],
  },
  {
    label: 'Informe a Localização (Opcional)',
    description: 'Ajude a identificar o local exato',
    icon: MapPin,
    content: [
      'A localização ajuda a identificar onde o fato ocorreu',
      'Você pode usar sua localização atual ou inserir manualmente',
      'A localização é opcional e pode ser omitida se preferir',
    ],
  },
  {
    label: 'Escolha a Identificação',
    description: 'Anônimo ou identificado',
    icon: User,
    content: [
      'Registro Anônimo: nenhuma informação pessoal é coletada',
      'Registro Identificado: você fornece dados para contato',
      'Ambos os tipos recebem protocolo e são processados igualmente',
      'Escolha a opção com a qual se sente mais confortável',
    ],
  },
  {
    label: 'Revise e Finalize',
    description: 'Confira todas as informações antes de enviar',
    icon: Eye,
    content: [
      'Revise a descrição e verifique se está completa',
      'Confirme os anexos adicionados',
      'Verifique a localização (se informada)',
      'Confirme o tipo de identificação escolhido',
      'Após finalizar, você receberá um protocolo único',
    ],
  },
] as const;

const GOOD_PRACTICES = [
  'Seja objetivo e direto na descrição',
  'Mantenha o respeito e a educação em todas as manifestações',
  'Forneça informações verdadeiras e precisas',
  'Guarde o protocolo recebido para acompanhamento',
  'Evite incluir dados pessoais sensíveis na descrição',
];

export const Guidelines = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [activeStep, setActiveStep] = useState(0);
  const textStyle = { fontSize: `${fontSize}px`, lineHeight: 1.8 } as React.CSSProperties;

  return (
    <PageLayout maxWidth="page" padding="md">
      <PageHeader
        title="Orientações para Relatar"
        description="Siga estas orientações para criar um registro completo e eficaz"
      />

      <Alert variant="info" className="mb-8 border border-border" role="note">
        <AlertDescription style={textStyle}>
          <strong>Dica:</strong> Quanto mais detalhado e completo for seu registro, melhor será o atendimento e mais rápida será a resposta.
        </AlertDescription>
      </Alert>

      <Card className={cn('mb-6', highContrast && 'border-white bg-black')}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <div key={step.label} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-0 font-semibold hover:bg-transparent"
                    style={{ fontSize: `calc(${fontSize}px * 1.2)` }}
                    onClick={() => setActiveStep(isActive ? -1 : index)}
                    aria-expanded={isActive}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-participa-blue" aria-hidden />
                      {step.label}
                    </span>
                    {isActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                  <p className="mb-2 pl-7 text-sm text-muted-foreground">{step.description}</p>
                  {isActive && (
                    <ul className="space-y-2 pl-7">
                      {step.content.map((item, i) => (
                        <li key={`${step.label}-${i}`} className="flex items-start gap-2" style={textStyle}>
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-participa-blue" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className={cn('mb-6', highContrast && 'border-white bg-black')}>
        <CardContent className="flex gap-4 pt-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <ClipboardList className="h-8 w-8 text-participa-blue" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="mb-4 font-semibold" style={{ fontSize: `calc(${fontSize}px * 1.5)` }}>
              Boas Práticas
            </h2>
            <ul className="space-y-2">
              {GOOD_PRACTICES.map((item) => (
                <li key={item} className="flex items-start gap-2" style={textStyle}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-participa-blue" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert variant="warning" role="alert" className="border border-border">
        <AlertDescription style={textStyle}>
          <strong>Atenção:</strong> Registros falsos, caluniosos ou difamatórios podem resultar em responsabilização legal. Use este canal de forma responsável e ética.
        </AlertDescription>
      </Alert>
    </PageLayout>
  );
};
