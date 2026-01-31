# Design System – Participa DF

Fonte única de verdade: `tokens.ts` e `tailwind.config.js` (cores, sombras, max-width).

## Convenções

### Tipografia
- **Fonte:** Plus Jakarta Sans (Tailwind `font-sans`).
- **Títulos de página:** `PageHeader` com `titleClassName` padrão `text-xl font-bold tracking-tight sm:text-2xl`.
- **Títulos de seção:** `SectionTitle` (`text-lg font-semibold sm:text-xl`).

### Raios (border-radius)
- **Cards / painéis:** `rounded-lg` (componente `Card` já aplica).
- **Ícones em cards (caixa do ícone):** `rounded-xl`.
- **Inputs, Textarea, Alert:** `rounded-xl`.
- **Botões:** `rounded-lg` (padrão), `rounded-md` em `size="sm"`.

### Sombras
- **Card padrão:** `shadow-sm` (aplicado no componente `Card`).
- **Card hover:** `shadow-card-hover` (em listagens/cards clicáveis).
- **Botão primário hover:** `shadow-glow-sm` (opcional).

### Layout de páginas
- **Páginas internas:** `PageLayout` + `PageHeader`; `maxWidth`: `page` (72rem), `prose` (65ch) ou `full`.
- **Seções (ex.: Início):** `SECTION_CONTAINER`, `SECTION_BLOCK`, `SectionTitle`.

### Cores de marca
- **Primário:** `participa-blue` (#005FDB), hover `participa-blue-dark`.
- **Superfícies:** header/rodapé `#0a1628`; fundo `background` (CSS var).
