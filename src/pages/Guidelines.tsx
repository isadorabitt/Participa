import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Preview as PreviewIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const steps = [
  {
    label: 'Descreva o Fato',
    description: 'Forneça uma descrição detalhada e objetiva',
    icon: <DescriptionIcon />,
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
    icon: <LocationOnIcon />,
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
    icon: <LocationOnIcon />,
    content: [
      'A localização ajuda a identificar onde o fato ocorreu',
      'Você pode usar sua localização atual ou inserir manualmente',
      'A localização é opcional e pode ser omitida se preferir',
    ],
  },
  {
    label: 'Escolha a Identificação',
    description: 'Anônimo ou identificado',
    icon: <PersonIcon />,
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
    icon: <PreviewIcon />,
    content: [
      'Revise a descrição e verifique se está completa',
      'Confirme os anexos adicionados',
      'Verifique a localização (se informada)',
      'Confirme o tipo de identificação escolhido',
      'Após finalizar, você receberá um protocolo único',
    ],
  },
];

export const Guidelines = () => {
  const { fontSize, highContrast } = useAccessibility();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: `calc(${fontSize}px * 2)` }}
        >
          Orientações para Relatar
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: `${fontSize}px` }}
        >
          Siga estas orientações para criar um registro completo e eficaz
        </Typography>
      </Box>

      <Alert severity="info" sx={{ marginBottom: 4, fontSize: `${fontSize}px` }} role="note">
        <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
          <strong>Dica:</strong> Quanto mais detalhado e completo for seu registro, 
          melhor será o atendimento e mais rápida será a resposta.
        </Typography>
      </Alert>

      <Paper
        elevation={2}
        sx={{
          padding: 4,
          marginBottom: 4,
          backgroundColor: highContrast ? '#000' : 'background.paper',
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiStepLabel-label': {
                    fontSize: `calc(${fontSize}px * 1.2)`,
                  },
                }}
                icon={step.icon}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: `${fontSize}px` }}
                >
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <List>
                  {step.content.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ paddingLeft: 0 }}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#005FDB15',
                          }}
                        >
                          <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          padding: 4,
          marginBottom: 4,
          backgroundColor: highContrast ? '#000' : 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #005FDB15 0%, #005FDB08 100%)',
              border: '2px solid #005FDB20',
              flexShrink: 0,
            }}
          >
            <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontSize: `calc(${fontSize}px * 1.5)` }}
            >
              Boas Práticas
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#005FDB15',
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Seja objetivo e direto na descrição"
                  primaryTypographyProps={{
                    sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#005FDB15',
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Mantenha o respeito e a educação em todas as manifestações"
                  primaryTypographyProps={{
                    sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#005FDB15',
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Forneça informações verdadeiras e precisas"
                  primaryTypographyProps={{
                    sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#005FDB15',
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Guarde o protocolo recebido para acompanhamento"
                  primaryTypographyProps={{
                    sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#005FDB15',
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Evite incluir dados pessoais sensíveis na descrição"
                  primaryTypographyProps={{
                    sx: { fontSize: `${fontSize}px`, lineHeight: 1.8 },
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>

      <Alert severity="warning" role="alert" sx={{ fontSize: `${fontSize}px` }}>
        <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
          <strong>Atenção:</strong> Registros falsos, caluniosos ou difamatórios podem 
          resultar em responsabilização legal. Use este canal de forma responsável e ética.
        </Typography>
      </Alert>
    </Container>
  );
};

