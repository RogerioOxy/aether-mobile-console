// ==========================================================================
// GERADOR MOCK DE TELEMETRIA (subsistema S1 - Telemetry & Sensors, simulado)
// ==========================================================================
// Produz leituras SIMULADAS das metricas canonicas (secao 4 do spec) usando
// um "random walk" em torno do valor base de cada metrica. De tempos em tempos
// injeta uma "anomalia" controlada para que os niveis de alerta (ATENCAO/
// ALERTA/CRITICO) realmente disparem durante a demonstracao.
//
// O consumo via setInterval e feito no MissionContext (estado global).
// Aqui ficam apenas funcoes puras + a fabrica de leituras.

import { METRICS } from '../../constants/telemetry';

// Sorteia um numero no intervalo [-amp, +amp].
function noise(amp) {
  return (Math.random() * 2 - 1) * amp;
}

// Mantem o valor dentro dos limites fisicos da metrica.
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Cria o snapshot inicial: cada metrica no seu valor base + um pequeno ruido.
export function initialReadings() {
  const snapshot = {};
  for (const m of METRICS) {
    snapshot[m.id] = round(clamp(m.base + noise(m.jitter * 0.4), m.min, m.max), m);
  }
  return snapshot;
}

// Avanca um "tick": a partir do snapshot anterior, aplica random walk.
// A cada tick ha uma pequena chance de "evento anomalo" que empurra UMA
// metrica em direcao a uma faixa de alerta -- garante alertas visiveis na demo.
export function nextReadings(previous) {
  const snapshot = {};
  // ~22% de chance de provocar uma anomalia neste tick.
  const anomalyId =
    Math.random() < 0.22 ? METRICS[Math.floor(Math.random() * METRICS.length)].id : null;

  for (const m of METRICS) {
    const prev = previous[m.id] ?? m.base;
    // Tendencia suave de retorno ao valor base (mean reversion) + ruido.
    const pull = (m.base - prev) * 0.15;
    let value = prev + pull + noise(m.jitter);

    if (m.id === anomalyId) {
      value = applyAnomaly(m, value);
    }

    snapshot[m.id] = round(clamp(value, m.min, m.max), m);
  }
  return snapshot;
}

// Empurra o valor em direcao ao "lado ruim" da metrica, de forma controlada.
function applyAnomaly(metric, value) {
  const span = metric.max - metric.min;
  const push = span * (0.18 + Math.random() * 0.22); // 18% a 40% da faixa
  if (metric.direction === 'below') {
    // piora caindo -> subtrai
    return value - push;
  }
  if (metric.direction === 'above') {
    // piora subindo -> soma
    return value + push;
  }
  if (metric.direction === 'band') {
    // afasta da base para um dos lados aleatoriamente
    return value + (Math.random() < 0.5 ? -push : push);
  }
  return value; // informativa: nao force anomalia critica
}

// Arredonda conforme a granularidade da metrica (decimais para valores pequenos).
function round(value, metric) {
  const small = metric.max - metric.min <= 5; // ex.: radiacao, atitude, tensao
  const factor = small ? 100 : 1; // 2 casas decimais p/ metricas pequenas
  return Math.round(value * factor) / factor;
}
