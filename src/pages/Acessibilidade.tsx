import { Card, CardContent, CardHeader } from '../components/ui/card';
import { PageLayout, PageHeader } from '../components/PageLayout';

export const Acessibilidade = () => (
  <PageLayout maxWidth="prose" padding="md">
    <PageHeader
      title="Acessibilidade"
      description="Este portal utiliza a ferramenta de acessibilidade do Governo do Distrito Federal."
    />

    <Card className="mb-8 shadow-sm">
      <CardHeader>
        <h2 className="text-xl font-semibold text-foreground">Botões de Acessibilidade e Libras</h2>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          No topo da página (barra azul) e no rodapé você encontra os botões:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2 text-sm text-muted-foreground">
          <li><strong>Acessibilidade:</strong> abre esta página com informações e recursos.</li>
          <li><strong>Libras:</strong> abre o tradutor VLibras (Língua Brasileira de Sinais) do Governo Federal.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          O VLibras também pode ser acessado pelo botão flutuante no canto da tela (ícone de mãos).
          Com ele, textos do portal são traduzidos para Libras em vídeo.
        </p>
        <p className="text-sm text-muted-foreground">
          O Participa DF segue as diretrizes WCAG 2.1 e utiliza o plugin de acessibilidade do
          Governo do Distrito Federal quando disponível no portal.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-foreground">Sobre a acessibilidade</h2>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Este sistema foi desenvolvido seguindo as diretrizes WCAG 2.1 Nível AA, garantindo
          que seja acessível para todos os usuários.
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2 text-sm text-muted-foreground">
          <li><strong>Alto contraste:</strong> aumenta o contraste entre texto e fundo.</li>
          <li><strong>Tamanho da fonte:</strong> ajuste pelo plugin do Governo.</li>
          <li><strong>Navegação por teclado:</strong> atalhos e foco visível em elementos interativos.</li>
        </ul>
      </CardContent>
    </Card>
  </PageLayout>
);
