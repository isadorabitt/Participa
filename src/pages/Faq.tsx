import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';
import { useState, useMemo } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'O que é o sistema Participa?',
    answer:
      'O Participa é um sistema de ouvidoria digital que permite aos cidadãos fazer registros de reclamações, sugestões, elogios, denúncias e solicitações de informação de forma rápida e acessível.',
    category: 'Geral',
  },
  {
    question: 'Como faço um registro?',
    answer:
      'Acesse a opção "Novo Registro" no menu lateral e preencha o formulário passo a passo. Você precisará fornecer uma descrição detalhada do fato e pode adicionar anexos (áudio, imagem ou vídeo) se desejar.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Posso fazer um registro anônimo?',
    answer:
      'Sim! Você pode escolher fazer o registro de forma anônima ou identificada. Em ambos os casos, você receberá um protocolo para acompanhamento e seu registro será processado igualmente.',
    category: 'Privacidade',
  },
  {
    question: 'Quanto tempo leva para receber uma resposta?',
    answer:
      'Os prazos variam conforme o tipo de manifestação: reclamações e denúncias têm prazo de até 30 dias (podendo ser prorrogado), solicitações de informação têm prazo de até 20 dias, e sugestões/elogios são analisados conforme disponibilidade.',
    category: 'Prazos',
  },
  {
    question: 'Como acompanho meu registro?',
    answer:
      'Após finalizar seu registro, você receberá um protocolo único. Use esse protocolo na seção "Meus Registros" para acompanhar o andamento e verificar atualizações.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Posso adicionar anexos ao meu registro?',
    answer:
      'Sim! Você pode adicionar áudio (gravação), imagem (foto) ou vídeo como anexos ao seu registro. Isso ajuda a enriquecer a informação e facilitar a análise do caso.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Meus dados pessoais estão seguros?',
    answer:
      'Sim. Todos os dados são tratados com sigilo e confidencialidade, conforme a legislação de proteção de dados pessoais. Você pode optar por fazer registros anônimos se preferir não fornecer informações pessoais.',
    category: 'Privacidade',
  },
  {
    question: 'O que fazer se esqueci meu protocolo?',
    answer:
      'Se você fez um registro identificado, pode acessar "Meus Registros" e visualizar todos os seus registros anteriores. Se fez um registro anônimo, é importante guardar o protocolo, pois ele é necessário para acompanhamento.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Posso editar um registro após enviá-lo?',
    answer:
      'Não, após finalizar e receber o protocolo, o registro não pode ser editado. Se precisar fazer alterações ou adicionar informações, você pode criar um novo registro fazendo referência ao protocolo anterior.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Quais tipos de manifestação posso fazer?',
    answer:
      'Você pode fazer reclamações (insatisfação com serviço), sugestões (propostas de melhoria), elogios (reconhecimento positivo), denúncias (irregularidades) e solicitações de informação (pedidos de dados públicos).',
    category: 'Geral',
  },
  {
    question: 'A localização é obrigatória?',
    answer:
      'Não, a localização é opcional. Você pode informar a localização do fato ocorrido se desejar, mas não é obrigatório. Isso ajuda a identificar o local exato quando relevante.',
    category: 'Uso do Sistema',
  },
  {
    question: 'Como funciona a acessibilidade do sistema?',
    answer:
      'O sistema possui recursos de acessibilidade como ajuste de tamanho de fonte, alto contraste e navegação por teclado. Acesse a seção "Acessibilidade" no menu para configurar essas opções.',
    category: 'Acessibilidade',
  },
];

export const Faq = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return faqItems;
    const term = searchTerm.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const categories = useMemo(() => {
    return Array.from(new Set(faqItems.map((item) => item.category)));
  }, []);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: `calc(${fontSize}px * 2)` }}
        >
          Perguntas Frequentes (FAQ)
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: `${fontSize}px` }}
        >
          Encontre respostas para as dúvidas mais comuns sobre o sistema
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar perguntas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: '#005FDB10',
                  marginRight: 1,
                }}
              >
                <SearchIcon sx={{ color: '#005FDB', fontSize: 22 }} />
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          marginBottom: 4,
          '& .MuiInputBase-input': {
            fontSize: `${fontSize}px`,
          },
        }}
        aria-label="Buscar perguntas frequentes"
      />

      {filteredItems.length === 0 && (
        <Alert severity="info" sx={{ marginBottom: 4, fontSize: `${fontSize}px` }}>
          <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
            Nenhuma pergunta encontrada com o termo "{searchTerm}". Tente buscar com outras palavras.
          </Typography>
        </Alert>
      )}

      <Box sx={{ marginBottom: 4 }}>
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <Box key={category} sx={{ marginBottom: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontSize: `calc(${fontSize}px * 1.5)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <HelpOutlineIcon color="primary" />
                {category}
              </Typography>
              {categoryItems.map((item, index) => {
                const panelId = `${category}-${index}`;
                return (
                  <Accordion
                    key={index}
                    expanded={expanded === panelId}
                    onChange={handleChange(panelId)}
                    sx={{
                      marginBottom: 2,
                      backgroundColor: highContrast ? '#000' : 'background.paper',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${panelId}-content`}
                      id={`${panelId}-header`}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: `calc(${fontSize}px * 1.1)` }}
                      >
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                      >
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          );
        })}
      </Box>

      <Alert severity="info" role="note" sx={{ fontSize: `${fontSize}px` }}>
        <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
          <strong>Não encontrou sua resposta?</strong> Você pode fazer um novo registro na 
          seção "Novo Registro" para solicitar informações adicionais ou esclarecer dúvidas.
        </Typography>
      </Alert>
    </Container>
  );
};

