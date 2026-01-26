import {
  Box,
  Typography,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';

export const About = () => {
  const { fontSize, highContrast } = useAccessibility();

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontSize: `calc(${fontSize}px * 2)` }}
        >
          O que é Ouvidoria
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: `${fontSize}px` }}
        >
          Entenda o papel da ouvidoria e como ela pode ajudá-lo
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          padding: 4,
          marginBottom: 4,
          backgroundColor: highContrast ? '#000' : 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginBottom: 3 }}>
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
            <InfoIcon color="primary" sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontSize: `calc(${fontSize}px * 1.5)` }}
            >
              Definição
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              A ouvidoria é um canal de comunicação entre o cidadão e a instituição, 
              criado para receber, analisar e encaminhar manifestações da sociedade. 
              É um instrumento democrático que permite a participação cidadã na gestão pública 
              e na melhoria dos serviços oferecidos.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Através da ouvidoria, você pode registrar reclamações, sugestões, elogios, 
              denúncias e solicitações de informação, contribuindo para a transparência e 
              o controle social.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontSize: `calc(${fontSize}px * 1.5)`, marginBottom: 3 }}
        >
          Tipos de Manifestação
        </Typography>

        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="reclamacao-content"
            id="reclamacao-header"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
            >
              Reclamação
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Manifestação sobre insatisfação com serviço prestado, atendimento recebido 
              ou situação vivenciada. A reclamação é analisada e encaminhada ao setor responsável 
              para apuração e resposta.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sugestao-content"
            id="sugestao-header"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
            >
              Sugestão
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Proposta de melhoria para serviços, processos ou políticas. Suas sugestões 
              são analisadas e podem ser implementadas para aprimorar os serviços oferecidos.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="elogio-content"
            id="elogio-header"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
            >
              Elogio
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Reconhecimento positivo sobre serviço prestado ou atendimento recebido. 
              Os elogios são compartilhados com as equipes responsáveis e contribuem para 
              a valorização do trabalho realizado.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="denuncia-content"
            id="denuncia-header"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
            >
              Denúncia
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Comunicação sobre irregularidade, ilegalidade ou conduta inadequada. 
              As denúncias são tratadas com sigilo e encaminhadas aos órgãos competentes 
              para apuração.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="solicitacao-content"
            id="solicitacao-header"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: `calc(${fontSize}px * 1.2)` }}
            >
              Solicitação de Informação
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Pedido de informações sobre serviços, processos ou políticas. 
              As solicitações são respondidas de acordo com a Lei de Acesso à Informação.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Paper
        elevation={2}
        sx={{
          padding: 4,
          marginBottom: 4,
          backgroundColor: highContrast ? '#000' : 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginBottom: 3 }}>
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
            <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontSize: `calc(${fontSize}px * 1.5)` }}
            >
              Sigilo e Confidencialidade
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Todas as manifestações são tratadas com absoluto sigilo e confidencialidade. 
              Seus dados pessoais são protegidos conforme a legislação vigente sobre proteção 
              de dados pessoais.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Você pode fazer registros de forma anônima ou identificada, conforme sua preferência. 
              Em ambos os casos, seu registro será processado e você receberá um protocolo 
              para acompanhamento.
            </Typography>
          </Box>
        </Box>
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
            <AccessTimeIcon color="primary" sx={{ fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontSize: `calc(${fontSize}px * 1.5)` }}
            >
              Prazos de Resposta
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            >
              Os registros são analisados e respondidos dentro dos prazos estabelecidos pela 
              legislação. Você pode acompanhar o andamento do seu registro através do protocolo 
              recebido.
            </Typography>
            <Box component="ul" sx={{ paddingLeft: 3, marginTop: 2 }}>
              <li>
                <Typography
                  variant="body1"
                  sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                >
                  <strong>Reclamações e Denúncias:</strong> Até 30 dias (podendo ser prorrogado por mais 30 dias)
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                >
                  <strong>Solicitações de Informação:</strong> Até 20 dias (podendo ser prorrogado por mais 10 dias)
                </Typography>
              </li>
              <li>
                <Typography
                  variant="body1"
                  sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                >
                  <strong>Sugestões e Elogios:</strong> Análise e encaminhamento conforme disponibilidade
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Alert severity="info" role="note" sx={{ fontSize: `${fontSize}px` }}>
        <Typography variant="body2" sx={{ fontSize: `${fontSize}px` }}>
          <strong>Importante:</strong> A ouvidoria é um canal de participação cidadã. 
          Use este espaço para contribuir com a melhoria dos serviços e a transparência 
          da gestão pública.
        </Typography>
      </Alert>
    </Container>
  );
};

