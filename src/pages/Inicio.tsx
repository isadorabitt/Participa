import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Megaphone,
  Search as SearchIcon,
  LayoutDashboard,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle, SECTION_BLOCK, SECTION_CONTAINER } from '@/components/PageLayout';
import { useAccessibility } from '@/context/AccessibilityContext';

const SERVICOS = [
  {
    title: 'Nova Manifestação',
    description: 'Registre denúncias, elogios, sugestões ou reclamações.',
    icon: Megaphone,
    path: '/novo-registro',
  },
  {
    title: 'Consultar Protocolo',
    description: 'Acompanhe o andamento da sua manifestação.',
    icon: SearchIcon,
    path: '/meus-registros',
  },
  {
    title: 'Painel Ouvidoria',
    description: 'Indicadores e dados das ouvidorias do GDF.',
    icon: LayoutDashboard,
    path: '#',
  },
];

const NOTICIAS = [
  {
    title: 'Oficina sobre plantas medicinais chega à segunda edição',
    link: '#',
    image: 'https://picsum.photos/seed/plantas-400/400/240',
    imageAlt: 'Oficina sobre plantas medicinais',
  },
  {
    title: 'Rede pública do DF na Olimpíada Nacional de Ciências',
    link: '#',
    image: 'https://picsum.photos/seed/olimpiada-400/400/240',
    imageAlt: 'Estudantes na Olimpíada Nacional de Ciências',
  },
  {
    title: 'Resultado definitivo da Escola de Carnaval',
    link: '#',
    image: 'https://picsum.photos/seed/carnaval-400/400/240',
    imageAlt: 'Escola de Carnaval do DF',
  },
  {
    title: 'Paciente cola grau no Hospital Regional de Ceilândia',
    link: '#',
    image: 'https://picsum.photos/seed/hospital-400/400/240',
    imageAlt: 'Hospital Regional de Ceilândia',
  },
];

export function Inicio() {
  const navigate = useNavigate();
  const { fontSize } = useAccessibility();

  useEffect(() => {
    const onIza = () => globalThis.dispatchEvent(new CustomEvent('open-iza-assistant'));
    globalThis.addEventListener('open-iza', onIza);
    return () => globalThis.removeEventListener('open-iza', onIza);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero + CTA */}
      <section
        className="relative border-b border-border bg-gradient-to-b from-participa-blue/10 via-participa-blue/5 to-background"
        aria-label="Bem-vindo"
      >
        <div className={SECTION_CONTAINER + ' relative py-12 sm:py-16'}>
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-4xl"
              style={{ fontSize: `calc(${fontSize}px * 1.4)` }}
            >
              Portal de Participação Social do DF
            </h1>
            <p
              className="mb-8 text-muted-foreground"
              style={{ fontSize: `${fontSize}px` }}
            >
              Ouvidoria e Acesso à Informação em um só lugar.
            </p>

            <div className="mb-8">
              <div className="relative mx-auto max-w-md">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Buscar serviço ou informação..."
                  className="h-11 rounded-xl border border-border bg-white/95 shadow-sm backdrop-blur pl-10 transition-shadow hover:shadow-md focus:shadow-md"
                  aria-label="Buscar"
                />
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/novo-registro')}
              className="gap-2 rounded-xl bg-participa-blue px-8 py-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-participa-blue-dark hover:shadow-glow-sm"
            >
              <Plus className="h-5 w-5" aria-hidden />
              Criar manifestação
            </Button>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className={'border-b border-border bg-white ' + SECTION_BLOCK} aria-label="Serviços">
        <div className={SECTION_CONTAINER}>
          <SectionTitle>Serviços</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {SERVICOS.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.title}
                  className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-participa-blue/10 text-participa-blue">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">{s.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => s.path.startsWith('/') && navigate(s.path)}
                      asChild={s.path.startsWith('#')}
                      className="w-full rounded-lg border-border font-medium"
                    >
                      {s.path.startsWith('/') ? (
                        <span className="inline-flex items-center gap-1">
                          Acessar
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      ) : (
                        <a href={s.path} className="inline-flex items-center gap-1">
                          Acessar
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notícias */}
      <section className={'border-b border-border bg-muted/50 ' + SECTION_BLOCK} aria-label="Notícias">
        <div className={SECTION_CONTAINER}>
          <div className="mb-5 flex items-center justify-between sm:mb-6">
            <SectionTitle className="mb-0">Notícias</SectionTitle>
            <Link to="#" className="text-sm font-medium text-participa-blue hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NOTICIAS.map((n) => (
              <Card
                key={n.title}
                className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <a href={n.link} className="block">
                  <img
                    src={n.image}
                    alt={n.imageAlt}
                    className="h-40 w-full rounded-t-lg object-cover"
                    width={400}
                    height={240}
                    loading="lazy"
                  />
                </a>
                <CardContent className="p-4">
                  <p className="mb-3 line-clamp-3 text-sm font-medium leading-snug text-foreground">
                    {n.title}
                  </p>
                  <a
                    href={n.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-participa-blue transition-colors hover:underline"
                  >
                    Ler mais
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner 24h */}
      <section
        className="flex items-center justify-between gap-4 bg-[#0a1628] px-6 py-3 sm:px-6"
        aria-label="Administrações Regionais 24h"
      >
        <span className="text-sm text-white/95">
          Administrações Regionais <strong className="text-participa-yellow">atendem 24h</strong>
        </span>
        <img src="https://www.participa.df.gov.br/assets/images/participadf-branca.svg" alt="" className="h-6 w-auto" aria-hidden />
      </section>
    </div>
  );
}
