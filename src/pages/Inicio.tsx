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
      icon: <AddCircleIcon />,
      color: '#005FDB',
      gradient: 'linear-gradient(135deg, #005FDB 0%, #0048A8 100%)',
      path: '/novo-registro',
      ariaLabel: 'Ir para página de novo registro',
    },
    {
      title: 'Ajuda da IZA',
      description: 'Converse com nossa assistente virtual para tirar dúvidas e obter orientações',
      icon: <SmartToyIcon />,
      color: '#E1007A',
      gradient: 'linear-gradient(135deg, #E1007A 0%, #B80062 100%)',
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
      icon: <AssignmentIcon />,
      color: '#2E7D32',
      gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
      path: '/meus-registros',
      ariaLabel: 'Ir para página de meus registros',
    },
    {
      title: 'Orientações',
      description: 'Saiba como fazer um registro, quais informações incluir e como acompanhar',
      icon: <HelpOutlineIcon />,
      color: '#FFC107',
      gradient: 'linear-gradient(135deg, #FFC107 0%, #F57C00 100%)',
      path: '/orientacoes',
      ariaLabel: 'Ir para página de orientações',
    },
    {
      title: 'FAQ',
      description: 'Encontre respostas para as perguntas mais frequentes sobre o sistema',
      icon: <QuestionAnswerIcon />,
      color: '#0288D1',
      gradient: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)',
      path: '/faq',
      ariaLabel: 'Ir para página de perguntas frequentes',
    },
    {
      title: 'Acessibilidade',
      description: 'Configure opções de acessibilidade para personalizar sua experiência',
      icon: <AccessibilityIcon />,
      color: '#7B1FA2',
      gradient: 'linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)',
      path: '#',
      ariaLabel: 'Abrir configurações de acessibilidade',
      onClick: () => {
        // Disparar evento para abrir acessibilidade
        window.dispatchEvent(new CustomEvent('open-accessibility'));
      },
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginBottom: 5, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 3, sm: 5 },
            marginBottom: 5,
            flexWrap: 'wrap',
            paddingY: { xs: 2, sm: 3 },
          }}
        >
          <Box
            component="img"
            src="/logo-ouvidoria.svg"
            alt="Logo Ouvidoria do Governo do Distrito Federal"
            sx={{
              height: { xs: 70, sm: 110 },
              width: 'auto',
              maxWidth: { xs: '45%', sm: 'auto' },
              objectFit: 'contain',
              filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08))',
            }}
          />
          <Box
            component="img"
            src="/logo-participa-azul.svg"
            alt="Logo Participa DF"
            sx={{
              height: { xs: 60, sm: 90 },
              width: 'auto',
              maxWidth: { xs: '45%', sm: 'auto' },
              objectFit: 'contain',
              filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08))',
            }}
          />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: `calc(${fontSize}px * 2)`, sm: `calc(${fontSize}px * 2.5)` },
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 2,
          }}
        >
          Bem-vindo à Ouvidoria
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            fontSize: `calc(${fontSize}px * 1.125)`,
            color: '#4A4A4A',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '800px',
            marginX: 'auto',
          }}
        >
          Sistema de ouvidoria digital para registro de manifestações cidadãs. 
          Registre reclamações, sugestões, elogios, denúncias e solicitações de informação 
          de forma rápida e acessível.
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
          gap: 3,
          marginBottom: 5,
        }}
      >
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: '1px solid #E8E9EB',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0px 12px 24px rgba(0, 0, 0, 0.15), 0px 6px 12px rgba(0, 0, 0, 0.1), 0px 0px 0px 2px ${card.color}20`,
                borderColor: card.color,
                '& .card-icon': {
                  transform: 'scale(1.08)',
                  background: `linear-gradient(135deg, ${card.color}25 0%, ${card.color}15 100%)`,
                  borderColor: card.color,
                  boxShadow: `0px 6px 16px ${card.color}30`,
                  '& svg': {
                    transform: 'scale(1.1)',
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                  },
                },
                '& .card-gradient': {
                  opacity: 1,
                },
              },
              '&:focus-visible': {
                outline: '3px solid',
                outlineColor: card.color,
                outlineOffset: '4px',
              },
              '&:active': {
                transform: 'translateY(-4px) scale(1.01)',
              },
            }}
            onClick={() => {
              if (card.onClick) {
                card.onClick();
              } else {
                navigate(card.path);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (card.onClick) {
                  card.onClick();
                } else {
                  navigate(card.path);
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={card.ariaLabel}
          >
            {/* Gradiente de fundo no hover */}
            <Box
              className="card-gradient"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: card.gradient,
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
                zIndex: 0,
              }}
            />
            
            <CardActionArea
              sx={{
                height: '100%',
                padding: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '& .MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <CardContent
                sx={{
                  padding: 4,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  className="card-icon"
                  sx={{
                    color: card.color,
                    marginBottom: 2.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 88,
                    height: 88,
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}08 100%)`,
                    border: `2px solid ${card.color}20`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0px 4px 12px ${card.color}15`,
                    '& svg': {
                      fontSize: 44,
                      filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
                    },
                  }}
                >
                  {card.icon}
                </Box>
                
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: `calc(${fontSize}px * 1.25)`,
                    color: '#1A1A1A',
                    marginBottom: 1.5,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4A4A4A',
                    fontSize: `calc(${fontSize}px * 0.9375)`,
                    lineHeight: 1.7,
                    maxWidth: '90%',
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
          backgroundColor: '#FFFFFF',
          borderRadius: 2,
          padding: 4,
          border: '1px solid #E8E9EB',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: `calc(${fontSize}px * 1.5)`,
            color: '#1A1A1A',
            marginBottom: 2,
          }}
        >
          Como funciona
        </Typography>
        <Box component="ol" sx={{ paddingLeft: 3, margin: 0 }}>
          <li>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8, marginBottom: 2 }}
            >
              <strong>Crie um registro:</strong> Descreva sua manifestação e adicione anexos 
              (áudio, imagem ou vídeo) se necessário.
            </Typography>
          </li>
          <li>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8, marginBottom: 2 }}
            >
              <strong>Escolha a identificação:</strong> Você pode fazer o registro de forma 
              anônima ou identificada.
            </Typography>
          </li>
          <li>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8, marginBottom: 2 }}
            >
              <strong>Receba o protocolo:</strong> Após finalizar, você receberá um protocolo 
              único para acompanhar o andamento.
            </Typography>
          </li>
          <li>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              <strong>Acompanhe:</strong> Use o protocolo na seção "Meus Registros" para 
              verificar atualizações.
            </Typography>
          </li>
        </Box>
      </Box>
    </Container>
  );
};

