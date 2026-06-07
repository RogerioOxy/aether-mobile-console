// ==========================================================================
// ALERT ENGINE (subsistema S3) - classificacao de niveis de alerta
// ==========================================================================
// Recebe o valor atual de uma metrica + os limiares vigentes e devolve o
// nivel canonico (NOMINAL / ATENCAO / ALERTA / CRITICO), conforme secao 5 do
// spec. Logica PURA (sem efeitos colaterais) -- facil de testar e reutilizar
// nos dashboards e no painel de alertas.

import { getMetric } from '../constants/telemetry';
import { STATUS_COLORS } from '../theme/theme';

// Ordem de severidade (do mais grave ao menos grave).
const SEVERITY_ORDER = ['CRITICO', 'ALERTA', 'ATENCAO', 'NOMINAL'];

// Avalia um valor contra um conjunto de limiares de uma metrica.
// metricId   : id da metrica (ex.: 'batteryPct')
// value      : valor numerico atual
// thresholds : objeto de limiares vigente para essa metrica (pode ser null)
// Retorna sempre uma das strings de ALERT_LEVELS.
export function evaluateLevel(metricId, value, thresholds) {
  const metric = getMetric(metricId);
  // Metrica informativa ou sem limiares -> sempre NOMINAL.
  if (!metric || !thresholds || metric.direction === 'informative') {
    return 'NOMINAL';
  }

  const { direction } = metric;

  if (direction === 'below') {
    // Piora quando o valor CAI. Verifica do mais grave ao menos grave.
    if (isNum(thresholds.critico) && value <= thresholds.critico) return 'CRITICO';
    if (isNum(thresholds.alerta) && value <= thresholds.alerta) return 'ALERTA';
    if (isNum(thresholds.atencao) && value <= thresholds.atencao) return 'ATENCAO';
    return 'NOMINAL';
  }

  if (direction === 'above') {
    // Piora quando o valor SOBE.
    if (isNum(thresholds.critico) && value >= thresholds.critico) return 'CRITICO';
    if (isNum(thresholds.alerta) && value >= thresholds.alerta) return 'ALERTA';
    if (isNum(thresholds.atencao) && value >= thresholds.atencao) return 'ATENCAO';
    return 'NOMINAL';
  }

  if (direction === 'band') {
    // Nominal dentro da faixa; piora ao sair dela (acima OU abaixo).
    if (isBand(thresholds.critico) && outOfBand(value, thresholds.critico)) return 'CRITICO';
    if (isBand(thresholds.alerta) && outOfBand(value, thresholds.alerta)) return 'ALERTA';
    if (isBand(thresholds.atencao) && outOfBand(value, thresholds.atencao)) return 'ATENCAO';
    return 'NOMINAL';
  }

  return 'NOMINAL';
}

// Cor associada a um nivel de alerta (secao 5/6 do spec).
export function levelColor(level) {
  return STATUS_COLORS[level] || STATUS_COLORS.NOMINAL;
}

// Rotulo legivel exibido na UI.
export function levelLabel(level) {
  switch (level) {
    case 'CRITICO':
      return 'CRITICO';
    case 'ALERTA':
      return 'ALERTA';
    case 'ATENCAO':
      return 'ATENCAO';
    default:
      return 'NOMINAL';
  }
}

// Dado um conjunto de niveis, retorna o mais grave (para status agregado).
export function worstLevel(levels) {
  for (const sev of SEVERITY_ORDER) {
    if (levels.includes(sev)) return sev;
  }
  return 'NOMINAL';
}

// Rank numerico (0 = NOMINAL ... 3 = CRITICO) para comparacoes e ordenacao.
export function levelRank(level) {
  const idx = SEVERITY_ORDER.indexOf(level);
  // SEVERITY_ORDER vai do mais grave ao menos grave; invertemos para o rank.
  return idx === -1 ? 0 : SEVERITY_ORDER.length - 1 - idx;
}

// ---------------- helpers internos ----------------
function isNum(v) {
  return typeof v === 'number' && !Number.isNaN(v);
}

function isBand(v) {
  return v && isNum(v.low) && isNum(v.high);
}

function outOfBand(value, band) {
  return value < band.low || value > band.high;
}
