import { Box, Typography, Container, Card, CardContent, CardActionArea } from '@mui/material';
import { useEffect } from 'react';
import {
  AddCircle as AddCircleIcon,
  Assignment as AssignmentIcon,
  HelpOutline as HelpOutlineIcon,
  SmartToy as SmartToyIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

export const Inicio = () => {
  const navigate = useNavigate();
  const { fontSize } = useAccessibility();

  // Listener para eventos de acessibilidade e IZA
  useEffect(() => {
    const handleOpenAccessibility = () => {
      // Disparar evento para abrir diálogo de acessibilidade
      window.dispatchEvent(new CustomEvent('open-accessibility-dialog'));
    };

    const handleOpenIza = () => {
      // Disparar evento para abrir IZA
      window.dispatchEvent(new CustomEvent('open-iza-assistant'));
    };

    window.addEventListener('open-accessibility', handleOpenAccessibility);
    window.addEventListener('open-iza', handleOpenIza);

    return () => {
      window.removeEventListener('open-accessibility', handleOpenAccessibility);
      window.removeEventListener('open-iza', handleOpenIza);
    };
  }, []);

  const dashboardCards = [
    {
      title: 'Novo Registro',
      description: 'Crie um novo registro de manifestação de forma rápida e simples',
      icon: <AddCircleIcon fontSize="large" />,
      color: '#005FDB',
      path: '/novo-registro',
      ariaLabel: 'Ir para página de novo registro',
    },
    {
      title: 'Ajuda da IZA',
      description: 'Converse com nossa assistente virtual para tirar dúvidas e obter orientações',
      icon: <SmartToyIcon fontSize="large" />,
      color: '#E1007A',
      path: '#',
      ariaLabel: 'Abrir assistente virtual IZA',
      onClick: () => {
        // Disparar evento para abrir IZA
        window.dispatchEvent(new CustomEvent('open-iza'));
      },
    },
    {
      title: 'Meus Registros',
      description: 'Visualize, acompanhe e gerencie todos os seus registros anteriores',
      icon: <AssignmentIcon fontSize="large" />,
      color: '#2E7D32',
      path: '/meus-registros',
      ariaLabel: 'Ir para página de meus registros',
    },
    {
      title: 'Orientações',
      description: 'Saiba como fazer um registro, quais informações incluir e como acompanhar',
      icon: <HelpOutlineIcon fontSize="large" />,
      color: '#FFC107',
      path: '/orientacoes',
      ariaLabel: 'Ir para página de orientações',
    },
    {
      title: 'FAQ',
      description: 'Encontre respostas para as perguntas mais frequentes sobre o sistema',
      icon: <QuestionAnswerIcon fontSize="large" />,
      color: '#0288D1',
      path: '/faq',
      ariaLabel: 'Ir para página de perguntas frequentes',
    },
    {
      title: 'Acessibilidade',
      description: 'Configure opções de acessibilidade para personalizar sua experiência',
      icon: <AccessibilityIcon fontSize="large" />,
      color: '#7B1FA2',
      path: '#',
      ariaLabel: 'Abrir configurações de acessibilidade',
      onClick: () => {
        // Disparar evento para abrir acessibilidade
        window.dispatchEvent(new CustomEvent('open-accessibility'));
      },
    },
  ];

  return (
    <Box sx={{
      backgroundColor: '#F8FAFC',
      minHeight: '100%',
      py: { xs: 2, sm: 3 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="lg">
        <Box sx={{ marginBottom: { xs: 6, sm: 8 }, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 3, sm: 6 },
              marginBottom: { xs: 4, sm: 6 },
              flexWrap: 'wrap',
            }}
          >
            <Box
              component="img"
              src="/logo-ouvidoria.svg"
              alt="Logo Ouvidoria"
              sx={{
                height: { xs: 60, sm: 100 },
                width: 'auto',
                filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.05))',
              }}
            />
            <Box
              component="img"
              src="/logo-participa-azul.svg"
              alt="Logo Participa DF"
              sx={{
                height: { xs: 50, sm: 85 },
                width: 'auto',
                filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.05))',
              }}
            />
          </Box>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: `calc(${fontSize}px * 1.75)`, sm: `calc(${fontSize}px * 2.5)` },
              fontWeight: 900,
              color: '#0F172A',
              marginBottom: 2.5,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}
          >
            Sua voz constrói o DF
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: `calc(${fontSize}px * 1)`, sm: `calc(${fontSize}px * 1.125)` },
              color: '#64748B',
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: '700px',
              marginX: 'auto',
              px: 2
            }}
          >
            Participe ativamente da gestão pública. Registre sua manifestação
            e ajude a construir uma cidade melhor para todos os cidadãos.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2.5, sm: 3.5 },
            marginBottom: 8,
          }}
        >
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 5,
                border: '1px solid rgba(0, 0, 0, 0.04)',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px -12px rgba(0, 95, 219, 0.12)',
                  borderColor: `${card.color}40`,
                  '& .card-icon-container': {
                    backgroundColor: `${card.color}15`,
                    transform: 'scale(1.05) rotate(3deg)',
                  },
                },
              }}
              onClick={() => card.onClick ? card.onClick() : navigate(card.path)}
              tabIndex={0}
              role="button"
              aria-label={card.ariaLabel}
            >
              <CardActionArea sx={{ height: '100%', p: 0 }}>
                <CardContent sx={{ p: { xs: 3.5, sm: 4.5 }, textAlign: 'center' }}>
                  <Box
                    className="card-icon-container"
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '24px',
                      backgroundColor: `${card.color}08`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      marginBottom: 3,
                      marginX: 'auto',
                      transition: 'all 0.4s ease',
                      border: `1px solid ${card.color}15`,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: '#1E293B',
                      marginBottom: 1.5,
                      fontSize: `calc(${fontSize}px * 1.25)`,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748B',
                      lineHeight: 1.6,
                      fontSize: `calc(${fontSize}px * 0.925)`,
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 6,
            padding: { xs: 4, sm: 6 },
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#0F172A',
              marginBottom: 4,
              fontSize: { xs: `calc(${fontSize}px * 1.5)`, sm: `calc(${fontSize}px * 2)` },
              letterSpacing: '-0.03em',
              textAlign: 'center'
            }}
          >
            Experiência Simplificada
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            {[
              { step: '01', title: 'Relate', text: 'Descreva sua manifestação com textos, imagens ou áudios.' },
              { step: '02', title: 'Identifique', text: 'Escolha entre manter o anonimato ou se identificar.' },
              { step: '03', title: 'Protocolo', text: 'Receba na hora o número para acompanhar seu pedido.' },
              { step: '04', title: 'Acompanhe', text: 'Veja o status e as respostas em tempo real.' },
            ].map((item, i) => (
              <Box key={i} textAlign="center">
                <Typography variant="h1" sx={{ fontSize: '3rem', fontWeight: 900, color: '#005FDB15', mb: -3 }}>
                  {item.step}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', mb: 1, fontSize: `${fontSize}px` }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, fontSize: `${fontSize}px` }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
