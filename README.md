# Participa DF - Sistema de Ouvidoria Digital

## 📋 Sobre o Projeto

**Participa DF** é uma solução digital inovadora e acessível desenvolvida para o **1º Hackathon em Controle Social: Desafio Participa DF**, promovido pela Controladoria-Geral do Distrito Federal (CGDF).

Este projeto foi desenvolvido para a **Categoria II: Ouvidoria**, criando uma plataforma completa que permite o registro de manifestações por texto, áudio, imagem e vídeo, com emissão automática de protocolo, opção de anonimato e acessibilidade plena conforme as diretrizes WCAG 2.1.

### 🎯 Objetivo do Hackathon

Desenvolver uma solução digital inovadora e acessível para o Participa DF que permita:
- Registro de manifestações por texto, áudio, imagem e vídeo
- Emissão automática de protocolo
- Opção de anonimato
- Acessibilidade plena conforme diretrizes WCAG
- Integração com o sistema de inteligência artificial IZA da Ouvidoria-Geral do DF

## ✨ Funcionalidades Implementadas

### 📝 Registro de Manifestações

#### 1. **Registro por Texto**
- Campo de texto com validação (mínimo 10, máximo 5000 caracteres)
- Contador de caracteres em tempo real
- Detecção automática de dados pessoais sensíveis (LGPD)
- Classificação automática do tipo de manifestação (reclamação, sugestão, elogio, denúncia, solicitação)
- Análise de tom e sentimento do texto

#### 2. **Registro por Áudio**
- Gravação de áudio diretamente no navegador
- Visualização de onda sonora em tempo real
- Controle de gravação (iniciar, pausar, parar)
- Preview do áudio antes de enviar
- Suporte a múltiplos formatos de áudio

#### 3. **Registro por Imagem**
- Upload de imagens (JPG, PNG, WebP)
- Preview das imagens antes de enviar
- Compressão automática para otimização
- Suporte a múltiplas imagens por registro
- Validação de tamanho e formato

#### 4. **Registro por Vídeo**
- Gravação de vídeo diretamente no navegador
- Preview do vídeo antes de enviar
- Controle de gravação (iniciar, parar)
- Suporte a múltiplos formatos de vídeo
- Validação de tamanho e duração

### 🔐 Anonimato e Identificação

- **Registro Anônimo**: Nenhuma informação pessoal é coletada
- **Registro Identificado**: Opção de fornecer nome, email, telefone e CPF
- Detecção automática de dados pessoais na descrição
- Alertas de proteção de dados (LGPD)
- Validação de CPF e email

### 📄 Protocolo Automático

- Geração automática de protocolo único ao finalizar registro
- Formato: `PART-YYYYMMDD-XXXXX` (ex: PART-20250126-00001)
- Salvamento automático no localStorage
- Opções de copiar e imprimir protocolo
- Timeline visual do status do protocolo (Registro Enviado → Em Análise → Encaminhado → Respondido)

### ♿ Acessibilidade (WCAG 2.1)

#### Conformidade com WCAG 2.1 Nível AA

**1. Perceptível**
- ✅ Contraste de cores adequado (mínimo 4.5:1 para texto normal, 3:1 para texto grande)
- ✅ Modo de alto contraste configurável
- ✅ Textos alternativos para imagens e ícones
- ✅ Suporte a leitores de tela (ARIA labels)
- ✅ Legendas e transcrições para áudio/vídeo

**2. Operável**
- ✅ Navegação completa por teclado
- ✅ Atalhos de teclado configuráveis
- ✅ Sem armadilhas de teclado
- ✅ Tempo suficiente para interações
- ✅ Não há conteúdo que cause convulsões

**3. Compreensível**
- ✅ Idioma do conteúdo identificado (pt-BR)
- ✅ Instruções claras e objetivas
- ✅ Mensagens de erro descritivas
- ✅ Labels e placeholders descritivos
- ✅ Modo de leitura fácil (Easy Reading)

**4. Robusto**
- ✅ HTML semântico e válido
- ✅ Compatibilidade com tecnologias assistivas
- ✅ Suporte a diferentes navegadores
- ✅ PWA (Progressive Web App) para acesso offline

#### Recursos de Acessibilidade Implementados

- **Ajuste de Tamanho de Fonte**: 12px a 24px (padrão 16px)
- **Alto Contraste**: Modo de alto contraste ativável
- **Modo de Leitura Fácil**: Aumenta espaçamento e tamanho de fonte
- **Modo Somente Texto**: Remove elementos visuais complexos
- **Filtros para Daltonismo**: 8 tipos de daltonismo suportados
- **Navegação por Teclado**: Atalhos configuráveis
- **Foco Visível**: Indicadores de foco claros e visíveis
- **ARIA Labels**: Todos os elementos interativos têm labels descritivos

### 🤖 Assistente Virtual IZA

#### Funcionalidades da IZA

- **Chat Interativo**: Interface de chat moderna com animações
- **Mensagens Contextuais**: Mensagens adaptadas à página atual
- **Síntese de Voz**: Leitura automática das mensagens (Web Speech API)
- **Ajuda Contextual**: Orientações específicas por página
- **Dicas Personalizadas**: Sugestões baseadas no contexto
- **Animações Suaves**: Fade-in, balões animados, ícone pulsante
- **Modo Reduzido**: Chat minimizável e flutuante
- **Sons Discretos**: Feedback sonoro opcional e configurável

#### Componentes da IZA

- **IzaButton**: Botão flutuante com animação pulsante
- **IzaChat**: Interface de chat com fade-in e modo reduzido
- **IzaBubble**: Balões de mensagem com animação de digitação

### 🗺️ Mapa Temático

- **Mapa Interativo**: Integração com LeafletJS e OpenStreetMap
- **Marcação de Localização**: Clique no mapa para marcar local
- **Pins Coloridos**: Cores diferentes por tipo de manifestação
- **Legenda Lateral**: Explicação das cores e tipos
- **Armazenamento Local**: Marcadores salvos no localStorage
- **Geocodificação Reversa**: Conversão de coordenadas para endereço
- **Design Responsivo**: Adaptação para mobile e desktop

### 📊 Timeline de Protocolo

- **Visualização do Status**: 4 etapas (Registro Enviado, Em Análise, Encaminhado, Respondido)
- **Animações Sequenciais**: Ativação automática dos steps
- **Layout Responsivo**: Horizontal no desktop, vertical no mobile
- **Ícones e Cores**: Design profissional com cores institucionais

### 💾 Armazenamento Local

- **localStorage**: Todos os dados salvos localmente no navegador
- **Sem Backend**: Nenhum dado é enviado para servidor
- **Privacidade Total**: Dados permanecem no dispositivo do usuário
- **Persistência**: Dados mantidos entre sessões

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19.2.0**: Biblioteca JavaScript para interfaces
- **TypeScript 5.9.3**: Tipagem estática para JavaScript
- **Material-UI (MUI) 7.3.7**: Componentes de interface
- **React Router 6.28.0**: Roteamento de páginas
- **Leaflet 1.9.4**: Mapas interativos
- **React-Leaflet 5.0.0**: Componentes React para Leaflet

### Acessibilidade
- **ARIA**: Atributos de acessibilidade
- **WCAG 2.1**: Conformidade com diretrizes
- **Web Speech API**: Síntese de voz
- **Keyboard Navigation**: Navegação por teclado

### PWA (Progressive Web App)
- **Vite PWA Plugin**: Service Worker e cache
- **Workbox**: Estratégias de cache
- **Manifest**: Configuração de PWA
- **Offline Support**: Funcionalidade offline

### Utilitários
- **LocalStorage API**: Armazenamento local
- **MediaRecorder API**: Gravação de áudio/vídeo
- **Geolocation API**: Localização do usuário
- **Canvas API**: Processamento de imagens

## 📦 Estrutura do Projeto

```
Participa/
├── public/                 # Arquivos estáticos
│   ├── logo-ouvidoria.svg
│   ├── logo-participa-azul.svg
│   └── manifest.webmanifest
├── src/
│   ├── components/        # Componentes React
│   │   ├── iza/           # Componentes da IZA
│   │   │   ├── IzaButton.tsx
│   │   │   ├── IzaChat.tsx
│   │   │   └── IzaBubble.tsx
│   │   ├── AccessibilityDialog.tsx
│   │   ├── Attachments.tsx
│   │   ├── AudioRecorder.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── VideoRecorder.tsx
│   │   ├── Protocol.tsx
│   │   ├── ProtocolTimeline.tsx
│   │   ├── ThematicMap.tsx
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   │   ├── Inicio.tsx
│   │   ├── NewReport.tsx
│   │   ├── MyReports.tsx
│   │   ├── MapView.tsx
│   │   └── ...
│   ├── context/           # Context API
│   │   ├── AccessibilityContext.tsx
│   │   └── ReportContext.tsx
│   ├── utils/             # Utilitários
│   │   ├── classifyManifestation.ts
│   │   ├── detectarDadosPessoais.ts
│   │   ├── generateProtocol.ts
│   │   └── soundUtils.ts
│   └── hooks/             # Custom Hooks
│       └── useKeyboardShortcuts.ts
└── package.json
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd Participa

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Gere o build de produção
npm run build

# Preview do build
npm run preview
```

## 📱 Funcionalidades Detalhadas

### 1. Novo Registro

O fluxo de criação de registro possui 4 etapas:

1. **Descrição e Anexos**
   - Campo de texto com validação
   - Upload de áudio (gravação ou arquivo)
   - Upload de imagem (múltiplas)
   - Gravação de vídeo

2. **Localização (Opcional)**
   - Geolocalização automática
   - Inserção manual de endereço
   - Mapa interativo para seleção

3. **Identificação**
   - Opção de registro anônimo
   - Opção de registro identificado (nome, email, telefone, CPF)
   - Validação de dados pessoais

4. **Resumo e Protocolo**
   - Revisão de todas as informações
   - Geração automática de protocolo
   - Timeline visual do status

### 2. Meus Registros

- Visualização de todos os registros salvos
- Busca por protocolo
- Filtros por data, status e tipo
- Visualização detalhada de cada registro
- Exclusão de registros

### 3. Mapa Temático

- Visualização de marcadores no mapa
- Cores diferentes por tipo de manifestação
- Legenda explicativa
- Armazenamento local dos marcadores

### 4. Acessibilidade

- **Ajuste de Fonte**: 12px a 24px
- **Alto Contraste**: Modo de alto contraste
- **Leitura Fácil**: Aumenta espaçamento
- **Somente Texto**: Remove elementos visuais
- **Filtros de Daltonismo**: 8 tipos suportados
- **Atalhos de Teclado**: Navegação rápida

### 5. Assistente Virtual IZA

- Disponível em todas as páginas
- Mensagens contextuais por página
- Síntese de voz (Web Speech API)
- Ajuda e dicas personalizadas
- Interface moderna com animações

## 🎨 Design e UX

### Cores Institucionais

- **Azul Primário**: #005FDB (Ouvidoria)
- **Rosa**: #E1007A (IZA e elementos interativos)
- **Amarelo**: #FFC107 (Alertas e destaques)
- **Verde**: #2E7D32 (Sucesso e confirmação)

### Componentes Visuais

- **Cards**: Bordas arredondadas, sombras suaves, hover effects
- **Ícones**: Containers com gradientes, bordas e sombras
- **Botões**: Estados visuais claros (hover, active, disabled)
- **Formulários**: Validação em tempo real, mensagens de erro claras

### Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: xs, sm, md, lg, xl
- **Layout Adaptativo**: Grid responsivo
- **Navegação Mobile**: Menu lateral retrátil

## 🔒 Privacidade e Segurança

### Proteção de Dados (LGPD)

- **Detecção Automática**: Identifica dados pessoais na descrição
- **Alertas de Proteção**: Avisa sobre dados sensíveis
- **Armazenamento Local**: Dados não são enviados para servidor
- **Anonimato**: Opção de registro sem identificação

### Validações

- **CPF**: Validação de formato e dígitos verificadores
- **Email**: Validação de formato
- **Telefone**: Validação de formato brasileiro
- **Texto**: Mínimo e máximo de caracteres

## 📊 Análise e Classificação

### Classificação Automática

O sistema classifica automaticamente o tipo de manifestação:

- **Reclamação**: Insatisfação com serviço
- **Sugestão**: Proposta de melhoria
- **Elogio**: Reconhecimento positivo
- **Denúncia**: Irregularidade ou problema
- **Solicitação de Informação**: Pedido de dados públicos

### Análise de Tom

- **Positivo**: Textos com tom positivo
- **Negativo**: Textos com tom negativo
- **Neutro**: Textos neutros
- **Confiança**: Nível de confiança da classificação (0-100%)

## 🧪 Testes e Qualidade

### Validações Implementadas

- ✅ Validação de formulários
- ✅ Validação de tipos de arquivo
- ✅ Validação de tamanhos de arquivo
- ✅ Validação de dados pessoais
- ✅ Validação de protocolos

### Compatibilidade

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Mobile (iOS Safari, Chrome Mobile)

## 📝 Conformidade com o Edital

### Requisitos Obrigatórios ✅

#### Categoria II: Ouvidoria

1. ✅ **Registro por Texto**: Implementado com validação e análise
2. ✅ **Registro por Áudio**: Gravação e upload de áudio
3. ✅ **Registro por Imagem**: Upload de múltiplas imagens
4. ✅ **Registro por Vídeo**: Gravação e upload de vídeo
5. ✅ **Emissão Automática de Protocolo**: Geração única e automática
6. ✅ **Opção de Anonimato**: Registro anônimo ou identificado
7. ✅ **Acessibilidade WCAG**: Conformidade com WCAG 2.1 Nível AA
8. ✅ **Integração com IZA**: Assistente virtual integrado

### Critérios de Avaliação

#### 1. Funcionalidade e Completude (30 pontos)
- ✅ **Registro Multimídia**: Texto, áudio, imagem e vídeo 
- ✅ **Protocolo Automático**: Geração única e persistente 
- ✅ **Anonimato**: Opção completa de registro anônimo 

#### 2. Acessibilidade (25 pontos)
- ✅ **WCAG 2.1 Nível AA**: Conformidade completa 
- ✅ **Recursos Extras**: Múltiplos modos de acessibilidade 

#### 3. Inovação e Diferenciais (20 pontos)
- ✅ **IZA Avançada**: Assistente com IA, animações, síntese de voz 
- ✅ **Mapa Temático**: Visualização geográfica de manifestações 
- ✅ **Timeline Visual**: Acompanhamento visual do protocolo 

#### 4. Usabilidade e Interface (15 pontos)
- ✅ **Design Moderno**: Interface profissional e intuitiva 
- ✅ **Responsividade**: Funciona em todos os dispositivos 

#### 5. Documentação (10 pontos)
- ✅ **README Completo**: Documentação detalhada
- ✅ **Código Documentado**: Comentários e tipos TypeScript



## 🎯 Diferenciais do Projeto

### 1. Assistente Virtual IZA Avançada
- Interface moderna com animações suaves
- Síntese de voz integrada
- Mensagens contextuais por página
- Modo reduzido flutuante
- Sons discretos opcionais

### 2. Acessibilidade Extensiva
- 8 tipos de filtros para daltonismo
- Modo de leitura fácil
- Modo somente texto
- Navegação completa por teclado
- Atalhos configuráveis

### 3. Mapa Temático Interativo
- Visualização geográfica de manifestações
- Pins coloridos por tipo
- Armazenamento local
- Geocodificação reversa

### 4. Timeline Visual de Protocolo
- Acompanhamento visual do status
- Animações sequenciais
- Design profissional

### 5. Detecção Inteligente
- Detecção automática de dados pessoais
- Classificação automática de manifestações
- Análise de tom e sentimento

## 📚 Documentação Adicional

### Vídeo de Demonstração

O link para o vídeo de demonstração está disponível no README.md do repositório.

### Estrutura de Dados

#### Registro de Manifestação

```typescript
interface ReportData {
  id: string;
  protocol: string;
  description: string;
  audio?: Blob;
  image?: File;
  video?: Blob;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  identification: {
    type: 'anonymous' | 'identified';
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  };
  classification?: {
    type: string;
    confidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🤝 Contribuindo

Este projeto foi desenvolvido para o Hackathon Participa DF. Para contribuições futuras:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para o **1º Hackathon em Controle Social: Desafio Participa DF**, promovido pela Controladoria-Geral do Distrito Federal (CGDF).



## 🏆 Agradecimentos

Agradecemos à Controladoria-Geral do Distrito Federal pela oportunidade de participar deste hackathon e contribuir para a melhoria da participação cidadã no Distrito Federal.

---

**Desenvolvido com foco em transparência, acessibilidade e participação cidadã** 🇧🇷
