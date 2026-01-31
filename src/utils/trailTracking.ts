/**
 * Sistema de trilhagem de protocolos com geração de descrições via IA (heurísticas + resumo).
 * Armazena a trilha (etapas) de cada protocolo e gera textos descritivos a partir do conteúdo do registro.
 */

import { summarizeText, extractKeywords } from './summarizeText';

export type TrailStageId = 'enviado' | 'em_analise' | 'encaminhado' | 'respondido';

export interface TrailEvent {
  id: string;
  stage: TrailStageId;
  date: string;
  description: string;
  generatedBy: 'system' | 'ai';
}

const STORAGE_KEY = 'participa_protocol_trail';

const STAGE_ORDER: TrailStageId[] = ['enviado', 'em_analise', 'encaminhado', 'respondido'];

const STAGE_LABELS: Record<TrailStageId, string> = {
  enviado: 'Registro Enviado',
  em_analise: 'Em Análise',
  encaminhado: 'Encaminhado',
  respondido: 'Respondido',
};

interface ReportForTrail {
  description?: string;
  summary?: string;
  classification?: { tipo?: string };
}

/**
 * Gera descrição da etapa usando resumo e palavras-chave do registro (IA heurística).
 */
export function generateStepDescription(
  stage: TrailStageId,
  report: ReportForTrail
): string {
  const description = report.description?.trim() || '';
  const summary = report.summary?.trim() || '';
  const text = summary || description;
  const keywords = text ? extractKeywords(text, 5) : [];
  const shortSummary = text ? summarizeText(text, 100) : '';

  switch (stage) {
    case 'enviado':
      return shortSummary
        ? `Registro recebido no sistema. Resumo: ${shortSummary}`
        : 'Registro recebido e cadastrado com sucesso.';
    case 'em_analise':
      if (keywords.length > 0) {
        return `Manifestação em análise pela equipe. Foco em: ${keywords.slice(0, 3).join(', ')}.`;
      }
      return 'Nossa equipe está analisando sua manifestação.';
    case 'encaminhado':
      if (report.classification?.tipo) {
        return `Registro encaminhado para o setor responsável (tipo: ${report.classification.tipo}).`;
      }
      return 'O registro foi encaminhado para o setor competente.';
    case 'respondido':
      return shortSummary
        ? `Manifestação finalizada. Registro tratado conforme solicitação.`
        : 'Sua manifestação foi respondida e o registro foi finalizado.';
    default:
      return 'Etapa registrada no sistema.';
  }
}

/**
 * Cria a trilha inicial (primeira etapa) ao gerar o protocolo.
 */
export function createInitialTrail(protocolId: string, report: ReportForTrail): TrailEvent[] {
  const description = generateStepDescription('enviado', report);
  return [
    {
      id: `trail-${protocolId}-enviado-${Date.now()}`,
      stage: 'enviado',
      date: new Date().toISOString(),
      description,
      generatedBy: 'ai',
    },
  ];
}

/**
 * Retorna a próxima etapa possível na trilha (ou null se já finalizado).
 */
export function getNextStage(currentTrail: TrailEvent[]): TrailStageId | null {
  const currentStages = new Set(currentTrail.map((e) => e.stage));
  for (const stage of STAGE_ORDER) {
    if (!currentStages.has(stage)) return stage;
  }
  return null;
}

/**
 * Adiciona a próxima etapa à trilha com descrição gerada por IA.
 */
export function appendNextTrailEvent(
  protocolId: string,
  currentTrail: TrailEvent[],
  report: ReportForTrail
): TrailEvent[] {
  const nextStage = getNextStage(currentTrail);
  if (!nextStage) return currentTrail;

  const newEvent: TrailEvent = {
    id: `trail-${protocolId}-${nextStage}-${Date.now()}`,
    stage: nextStage,
    date: new Date().toISOString(),
    description: generateStepDescription(nextStage, report),
    generatedBy: 'ai',
  };

  return [...currentTrail, newEvent];
}

export function getTrailForProtocol(protocolId: string): TrailEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const all: Record<string, TrailEvent[]> = JSON.parse(stored);
    const trail = all[protocolId];
    return Array.isArray(trail) ? trail : [];
  } catch {
    return [];
  }
}

export function saveTrailForProtocol(protocolId: string, trail: TrailEvent[]): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all: Record<string, TrailEvent[]> = stored ? JSON.parse(stored) : {};
    all[protocolId] = trail;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    if (import.meta.env.DEV) console.warn('Erro ao salvar trilha');
  }
}

export function getStageLabel(stage: TrailStageId): string {
  return STAGE_LABELS[stage];
}

export { STAGE_ORDER };
