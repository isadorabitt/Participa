import { useAccessibility } from '../context/AccessibilityContext';
import { useState, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PageLayout, PageHeader } from '../components/PageLayout';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  { question: 'O que é o sistema Participa?', answer: 'O Participa é um sistema de ouvidoria digital que permite aos cidadãos fazer registros de reclamações, sugestões, elogios, denúncias e solicitações de informação de forma rápida e acessível.', category: 'Geral' },
  { question: 'Como faço um registro?', answer: 'Acesse a opção "Novo Registro" no menu lateral e preencha o formulário passo a passo. Você precisará fornecer uma descrição detalhada do fato e pode adicionar anexos (áudio, imagem ou vídeo) se desejar.', category: 'Uso do Sistema' },
  { question: 'Posso fazer um registro anônimo?', answer: 'Sim! Você pode escolher fazer o registro de forma anônima ou identificada. Em ambos os casos, você receberá um protocolo para acompanhamento e seu registro será processado igualmente.', category: 'Privacidade' },
  { question: 'Quanto tempo leva para receber uma resposta?', answer: 'Os prazos variam conforme o tipo de manifestação: reclamações e denúncias têm prazo de até 30 dias (podendo ser prorrogado), solicitações de informação têm prazo de até 20 dias, e sugestões/elogios são analisados conforme disponibilidade.', category: 'Prazos' },
  { question: 'Como acompanho meu registro?', answer: 'Após finalizar seu registro, você receberá um protocolo único. Use esse protocolo na seção "Meus Registros" para acompanhar o andamento e verificar atualizações.', category: 'Uso do Sistema' },
  { question: 'Posso adicionar anexos ao meu registro?', answer: 'Sim! Você pode adicionar áudio (gravação), imagem (foto) ou vídeo como anexos ao seu registro. Isso ajuda a enriquecer a informação e facilitar a análise do caso.', category: 'Uso do Sistema' },
  { question: 'Meus dados pessoais estão seguros?', answer: 'Sim. Todos os dados são tratados com sigilo e confidencialidade, conforme a legislação de proteção de dados pessoais. Você pode optar por fazer registros anônimos se preferir não fornecer informações pessoais.', category: 'Privacidade' },
  { question: 'O que fazer se esqueci meu protocolo?', answer: 'Se você fez um registro identificado, pode acessar "Meus Registros" e visualizar todos os seus registros anteriores. Se fez um registro anônimo, é importante guardar o protocolo, pois ele é necessário para acompanhamento.', category: 'Uso do Sistema' },
  { question: 'Posso editar um registro após enviá-lo?', answer: 'Não, após finalizar e receber o protocolo, o registro não pode ser editado. Se precisar fazer alterações ou adicionar informações, você pode criar um novo registro fazendo referência ao protocolo anterior.', category: 'Uso do Sistema' },
  { question: 'Quais tipos de manifestação posso fazer?', answer: 'Você pode fazer reclamações (insatisfação com serviço), sugestões (propostas de melhoria), elogios (reconhecimento positivo), denúncias (irregularidades) e solicitações de informação (pedidos de dados públicos).', category: 'Geral' },
  { question: 'A localização é obrigatória?', answer: 'Não, a localização é opcional. Você pode informar a localização do fato ocorrido se desejar, mas não é obrigatório. Isso ajuda a identificar o local exato quando relevante.', category: 'Uso do Sistema' },
  { question: 'Como funciona a acessibilidade do sistema?', answer: 'O sistema possui recursos de acessibilidade como ajuste de tamanho de fonte, alto contraste e navegação por teclado. Acesse a seção "Acessibilidade" no menu para configurar essas opções.', category: 'Acessibilidade' },
];

export const Faq = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return faqItems;
    const term = searchTerm.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const categories = useMemo(() => Array.from(new Set(faqItems.map((item) => item.category))), []);

  const textStyle = { fontSize: `${fontSize}px`, lineHeight: 1.8 } as React.CSSProperties;

  return (
    <PageLayout maxWidth="page" padding="md">
      <PageHeader
        title="Perguntas Frequentes (FAQ)"
        description="Encontre respostas para as dúvidas mais comuns sobre o sistema"
      />

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder="Buscar perguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11"
          style={textStyle}
          aria-label="Buscar perguntas frequentes"
        />
      </div>

      {filteredItems.length === 0 && searchTerm.trim() && (
        <Alert variant="info" className="mb-8 border border-border">
          <AlertDescription style={textStyle}>
            Nenhuma pergunta encontrada com o termo &quot;{searchTerm}&quot;. Tente buscar com outras palavras.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category}>
              <h2
                className="mb-4 flex items-center gap-2 font-semibold text-foreground"
                style={{ fontSize: `calc(${fontSize}px * 1.5)` }}
              >
                <HelpCircle className="h-5 w-5 text-participa-blue" aria-hidden />
                {category}
              </h2>
              <div className="space-y-2">
                {categoryItems.map((item, index) => (
                  <details
                    key={`${category}-${index}`}
                    className={cn(
                      'group rounded-lg border border-border',
                      highContrast ? 'bg-black' : 'bg-card'
                    )}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-semibold focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden" style={{ fontSize: `calc(${fontSize}px * 1.1)` }}>
                      {item.question}
                      <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="border-t border-border px-4 py-3">
                      <p style={textStyle}>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Alert variant="info" role="note" className="mt-8 border border-border">
        <AlertDescription style={textStyle}>
          <strong>Não encontrou sua resposta?</strong> Você pode fazer um novo registro na seção &quot;Novo Registro&quot; para solicitar informações adicionais ou esclarecer dúvidas.
        </AlertDescription>
      </Alert>
    </PageLayout>
  );
};
