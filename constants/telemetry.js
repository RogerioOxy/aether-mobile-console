// ==========================================================================
// METRICAS DE TELEMETRIA CANONICAS (secao 4 do SPEC AETHER)
// ==========================================================================
// Fonte unica de verdade do dominio do AETHER Mobile Console (S6).
// Nomes de variavel em ingles (tecnico); rotulos de UI em PT-BR.
// Os limiares (thresholds) abaixo sao os VALORES PADRAO -- o operador pode
// reconfigura-los na tela de Configuracoes e a alteracao e persistida.
//
// Direcao do limiar (direction):
//   'below' -> o estado piora quando o valor CAI abaixo do limiar (ex.: bateria)
//   'above' -> o estado piora quando o valor SOBE acima do limiar (ex.: temperatura)
//   'band'  -> nominal dentro de uma faixa; piora ao sair dela (ex.: pressao da cabine)
//
// IMPORTANTE: estes numeros sao os do spec canonico. NAO inventar valores novos.

export const ALERT_LEVELS = ['NOMINAL', 'ATENCAO', 'ALERTA', 'CRITICO'];

// Rotulos de cada subsistema/dashboard (agrupamento das metricas).
export const GROUPS = {
  SENSORS: 'Sensores de Bordo',
  ENERGY: 'Energia',
  COMMS: 'Comunicacao',
  STABILITY: 'Estabilidade Orbital',
};

// Catalogo das metricas exibidas nos dashboards.
// id ........ chave estavel (usada em thresholds e no gerador mock)
// label ..... rotulo de UI em PT-BR
// unit ...... unidade fisica
// group ..... a qual dashboard pertence
// icon ...... nome do icone Ionicons
// direction . como o limiar deve ser interpretado (below | above | band)
// base ...... valor central usado pelo gerador mock (ponto de operacao nominal)
// jitter .... amplitude da variacao aleatoria a cada tick do gerador
// min / max . limites fisicos de saturacao do valor simulado
export const METRICS = [
  // ---------------- SENSORES DE BORDO ----------------
  {
    id: 'tempC',
    label: 'Temperatura',
    unit: 'C',
    group: GROUPS.SENSORS,
    icon: 'thermometer',
    direction: 'above',
    base: 24,
    jitter: 6,
    min: -10,
    max: 110,
  },
  {
    id: 'pressureKpa',
    label: 'Pressao da Cabine',
    unit: 'kPa',
    group: GROUPS.SENSORS,
    icon: 'speedometer',
    direction: 'band',
    base: 101,
    jitter: 3,
    min: 70,
    max: 130,
  },
  {
    id: 'radiationMsv',
    label: 'Radiacao',
    unit: 'mSv/h',
    group: GROUPS.SENSORS,
    icon: 'radio',
    direction: 'above',
    base: 0.25,
    jitter: 0.2,
    min: 0,
    max: 3,
  },
  // ---------------- ENERGIA ----------------
  {
    id: 'batteryPct',
    label: 'Bateria (SoC)',
    unit: '%',
    group: GROUPS.ENERGY,
    icon: 'battery-half',
    direction: 'below',
    base: 78,
    jitter: 5,
    min: 0,
    max: 100,
  },
  {
    id: 'busVoltage',
    label: 'Barramento Principal',
    unit: 'V',
    group: GROUPS.ENERGY,
    icon: 'flash',
    direction: 'below',
    base: 28,
    jitter: 1.5,
    min: 18,
    max: 32,
  },
  {
    id: 'solarOutput',
    label: 'Geracao Solar',
    unit: 'W',
    group: GROUPS.ENERGY,
    icon: 'sunny',
    direction: 'informative',
    base: 420,
    jitter: 90,
    min: 0,
    max: 700,
  },
  // ---------------- COMUNICACAO ----------------
  {
    id: 'signalDbm',
    label: 'Sinal',
    unit: 'dBm',
    group: GROUPS.COMMS,
    icon: 'cellular',
    direction: 'below',
    base: -78,
    jitter: 10,
    min: -120,
    max: -50,
  },
  {
    id: 'linkLatencyMs',
    label: 'Latencia do Enlace',
    unit: 'ms',
    group: GROUPS.COMMS,
    icon: 'pulse',
    direction: 'above',
    base: 320,
    jitter: 180,
    min: 80,
    max: 3200,
  },
  // ---------------- ESTABILIDADE ORBITAL ----------------
  {
    id: 'attitudeDevDeg',
    label: 'Desvio de Atitude',
    unit: 'graus',
    group: GROUPS.STABILITY,
    icon: 'compass',
    direction: 'above',
    base: 1.0,
    jitter: 1.2,
    min: 0,
    max: 14,
  },
  {
    id: 'altitudeKm',
    label: 'Altitude Orbital',
    unit: 'km',
    group: GROUPS.STABILITY,
    icon: 'rocket',
    direction: 'informative',
    base: 408,
    jitter: 6,
    min: 380,
    max: 430,
  },
];

// Limiares PADRAO por metrica, conforme secao 4 do spec.
// Cada nivel guarda o valor de gatilho; 'null' = nivel nao se aplica a essa metrica.
// Para 'band', usamos {low, high} em cada nivel.
export const DEFAULT_THRESHOLDS = {
  // ENERGIA
  batteryPct: { atencao: 40, alerta: 25, critico: 15 },                 // below
  busVoltage: { atencao: null, alerta: 24, critico: 22 },               // below
  solarOutput: null,                                                    // informativo
  // COMUNICACAO
  signalDbm: { atencao: -90, alerta: -100, critico: -110 },             // below. atencao/alerta = spec [verificado]; critico=-110 e [interpretacao]: o spec define CRITICO="sem link" sem numero (secao 4), entao adotamos -110 dBm como piso pratico de perda de enlace.
  linkLatencyMs: { atencao: 600, alerta: 1200, critico: 2500 },         // above
  // SENSORES
  tempC: { atencao: 40, alerta: 60, critico: 80 },                      // above
  pressureKpa: {                                                        // band
    atencao: { low: 95, high: 107 },
    alerta: { low: 90, high: 110 },
    critico: { low: 80, high: 120 },
  },
  radiationMsv: { atencao: 0.5, alerta: 1.0, critico: 2.0 },            // above
  // ESTABILIDADE
  attitudeDevDeg: { atencao: 2, alerta: 5, critico: 10 },               // above
  altitudeKm: null,                                                     // informativo
};

// Metricas que o operador pode reconfigurar na tela de Configuracoes.
// (Apenas as de direcao simples 'below'/'above' -- a faixa da pressao e fixa.)
export const CONFIGURABLE_METRICS = METRICS.filter(
  (m) => m.direction === 'below' || m.direction === 'above'
);

// Helper: retorna a metrica pelo id.
export function getMetric(id) {
  return METRICS.find((m) => m.id === id) || null;
}
