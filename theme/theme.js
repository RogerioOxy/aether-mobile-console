// ==========================================================================
// AETHER - Mission Control AI | Global Solution 2026.1 (Space Connect)
// Operadora: Orbital Climate Intelligence (OCI)
// RM561942 - Rogerio Deligi | RM562686 - Maria Fernanda Garavelli Dantas
// ==========================================================================
// Tokens visuais do AETHER Mobile Console (subsistema S6).
// Tema padrao = "Mission Control dark" (paleta canonica da secao 6 do spec).
// Tema claro = variante de baixo contraste para o toggle Dark/Light (bonus).
// Centraliza cores, espacamentos e tipografia para garantir consistencia.

// Cores de STATUS dos niveis de alerta (Alert Engine - secao 5 do spec).
// Compartilhadas entre os dois temas para preservar a semantica do alerta.
export const STATUS_COLORS = {
  NOMINAL: '#22C55E',  // verde   - tudo dentro do esperado
  ATENCAO: '#FACC15',  // amarelo - desvio leve, monitorar
  ALERTA: '#FB923C',   // laranja - acao recomendada
  CRITICO: '#EF4444',  // vermelho - falha iminente / risco a missao
};

// Paleta canonica Mission Control (secao 6 do spec).
const missionPalette = {
  primary: '#22D3EE',        // ciano telemetria
  secondary: '#F5A623',      // ambar Houston
  accentFiap: '#E91E63',     // acento FIAP (parcimonia)
  ...STATUS_COLORS,
  white: '#FFFFFF',
  black: '#000000',
};

// Tema ESCURO (padrao) - "controle de missao": fundo quase-preto azulado.
export const darkTheme = {
  mode: 'dark',
  colors: {
    ...missionPalette,
    background: '#0A0E1A',     // fundo profundo
    surface: '#161C2E',        // superficie/painel
    surfaceMuted: '#11172A',   // painel rebaixado (cabecalhos internos)
    border: '#233047',         // borda / linha de grade
    borderSoft: '#1B2336',     // borda sutil
    text: '#E5E7EB',           // texto principal
    textMuted: '#9CA3AF',      // texto suave
    textInverse: '#0A0E1A',    // texto sobre fundo claro (badges/botoes)
    grid: '#233047',           // linhas de grade dos graficos
    inputBg: '#11172A',
    placeholder: '#5B6478',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
};

// Tema CLARO - variante "daylight ops" para o toggle Dark/Light.
// Mantem as cores de status para nao quebrar a leitura dos alertas.
export const lightTheme = {
  mode: 'light',
  colors: {
    ...missionPalette,
    primary: '#0E7490',        // ciano mais escuro p/ contraste em fundo claro
    secondary: '#B45309',      // ambar mais escuro p/ contraste
    background: '#EEF2F7',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F7FB',
    border: '#D3DCE6',
    borderSoft: '#E5EBF1',
    text: '#0A0E1A',
    textMuted: '#5B6478',
    textInverse: '#FFFFFF',
    grid: '#D3DCE6',
    inputBg: '#FFFFFF',
    placeholder: '#9AA4B2',
    shadow: 'rgba(15, 23, 42, 0.10)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: 'bold' },
  heading: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  // Familia monoespacada para valores de telemetria (estilo Mission Control).
  // Usa o "monospace" de sistema (sempre disponivel, sem fontes externas).
  mono: { fontFamily: 'monospace' },
};
