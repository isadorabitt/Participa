import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Largura máxima do conteúdo (page = 72rem, full = sem limite) */
  maxWidth?: 'page' | 'prose' | 'full';
  /** Padding vertical (py-8, py-10, py-12) */
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'py-6',
  md: 'py-8 md:py-10',
  lg: 'py-10 md:py-14',
};

const maxWidthMap = {
  page: 'max-w-page',
  prose: 'max-w-prose',
  full: 'max-w-full',
};

/**
 * Layout padronizado para páginas internas: largura máxima, padding e fundo consistente.
 */
export function PageLayout({
  children,
  className,
  maxWidth = 'page',
  padding = 'md',
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        maxWidthMap[maxWidth],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  /** Estilo de fonte do título (respeita acessibilidade via inline style em cada página) */
  titleClassName?: string;
}

/**
 * Cabeçalho padronizado de página: título + descrição opcional.
 */
export function PageHeader({
  title,
  description,
  className,
  titleClassName = 'text-xl font-bold tracking-tight text-foreground sm:text-2xl',
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 md:mb-8', className)}>
      <h1 className={cn('mb-1.5', titleClassName)}>{title}</h1>
      {description && (
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}

/** Classe do container de seção (max-width + padding horizontal). */
export const SECTION_CONTAINER = 'mx-auto max-w-page px-4 sm:px-6 lg:px-8';

/** Classe do bloco de seção (padding vertical). */
export const SECTION_BLOCK = 'py-8 sm:py-10';

/**
 * Título de seção padronizado (ex.: Serviços, Notícias).
 */
export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'mb-5 text-lg font-semibold text-foreground sm:mb-6 sm:text-xl',
        className
      )}
    >
      {children}
    </h2>
  );
}
