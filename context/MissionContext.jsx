import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { DEFAULT_THRESHOLDS, METRICS } from '../constants/telemetry';
import { initialReadings, nextReadings } from '../services/mock/telemetryGenerator';
import { evaluateLevel, levelRank, worstLevel } from '../services/alertEngine';

// ==========================================================================
// MissionContext - estado global da missao (AETHER-1 / Houston Control)
// ==========================================================================
// Centraliza, via useReducer:
//   - readings:     ultimas leituras simuladas de telemetria (snapshot)
//   - history:      pequena serie temporal por metrica (para mini-graficos)
//   - thresholds:   limiares de alerta vigentes (persistidos)
//   - alerts:       historico de alertas disparados (persistido)
//   - running:      se o gerador mock esta ativo
//   - missionClock: contador de ticks (relogio da missao)
// Drive: um setInterval gera novas leituras a cada TICK_MS e o Alert Engine
// reclassifica os niveis, registrando novos alertas no historico.

const MissionContext = createContext(null);

const TICK_MS = 2000;        // intervalo do gerador mock (2s)
const HISTORY_LEN = 24;      // pontos guardados por metrica (mini-grafico)
const ALERT_LIMIT = 60;      // teto do historico de alertas persistido

// ---------------- reducer ----------------
const initialState = {
  hydrated: false,
  running: true,
  missionClock: 0,
  readings: initialReadings(),
  history: seedHistory(),
  thresholds: DEFAULT_THRESHOLDS,
  alerts: [],
};

function seedHistory() {
  // Inicializa a serie de cada metrica com seu primeiro snapshot.
  const first = initialReadings();
  const h = {};
  for (const m of METRICS) h[m.id] = [first[m.id]];
  return h;
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        thresholds: action.thresholds || state.thresholds,
        alerts: action.alerts || state.alerts,
        hydrated: true,
      };
    case 'TICK': {
      const readings = action.readings;
      // atualiza a serie temporal por metrica (janela deslizante)
      const history = {};
      for (const m of METRICS) {
        const prevSeries = state.history[m.id] || [];
        const series = [...prevSeries, readings[m.id]];
        if (series.length > HISTORY_LEN) series.shift();
        history[m.id] = series;
      }
      return {
        ...state,
        readings,
        history,
        missionClock: state.missionClock + 1,
        alerts: action.newAlerts.length
          ? [...action.newAlerts, ...state.alerts].slice(0, ALERT_LIMIT)
          : state.alerts,
      };
    }
    case 'SET_RUNNING':
      return { ...state, running: action.running };
    case 'SET_THRESHOLD': {
      // atualiza um nivel de uma metrica (ex.: tempC.alerta = 55)
      const { metricId, level, value } = action;
      const current = state.thresholds[metricId] || {};
      const updated = { ...current, [level]: value };
      return {
        ...state,
        thresholds: { ...state.thresholds, [metricId]: updated },
      };
    }
    case 'RESET_THRESHOLDS':
      return { ...state, thresholds: DEFAULT_THRESHOLDS };
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };
    default:
      return state;
  }
}

export function MissionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Refs para o setInterval enxergar sempre o estado mais recente sem recriar o timer.
  const readingsRef = useRef(state.readings);
  const thresholdsRef = useRef(state.thresholds);
  const levelsRef = useRef({}); // ultimo nivel conhecido por metrica
  const runningRef = useRef(state.running);

  readingsRef.current = state.readings;
  thresholdsRef.current = state.thresholds;
  runningRef.current = state.running;

  // ---- Hidratacao: limiares + historico de alertas ----
  useEffect(() => {
    (async () => {
      try {
        const [rawTh, rawAlerts] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.THRESHOLDS),
          AsyncStorage.getItem(STORAGE_KEYS.ALERT_HISTORY),
        ]);
        const thresholds = rawTh ? mergeThresholds(JSON.parse(rawTh)) : DEFAULT_THRESHOLDS;
        const alerts = rawAlerts ? JSON.parse(rawAlerts) : [];
        dispatch({ type: 'HYDRATE', thresholds, alerts });
      } catch (err) {
        console.warn('Falha ao hidratar a missao', err);
        dispatch({ type: 'HYDRATE' });
      }
    })();
  }, []);

  // ---- Loop do gerador mock (setInterval) ----
  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      const readings = nextReadings(readingsRef.current);
      const thresholds = thresholdsRef.current;

      // reavalia niveis e detecta TRANSICOES que geram alerta novo
      const newAlerts = [];
      for (const m of METRICS) {
        const level = evaluateLevel(m.id, readings[m.id], thresholds[m.id]);
        const prevLevel = levelsRef.current[m.id] || 'NOMINAL';
        // Registra alerta quando o nivel PIORA e nao e NOMINAL.
        if (level !== 'NOMINAL' && levelRank(level) > levelRank(prevLevel)) {
          newAlerts.push({
            id: `${Date.now()}-${m.id}`,
            metricId: m.id,
            metricLabel: m.label,
            unit: m.unit,
            value: readings[m.id],
            level,
            ts: new Date().toISOString(),
          });
        }
        levelsRef.current[m.id] = level;
      }

      dispatch({ type: 'TICK', readings, newAlerts });
    }, TICK_MS);

    return () => clearInterval(id);
  }, []); // timer unico durante a vida do provider

  // ---- Persistencia: limiares ----
  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(state.thresholds)).catch((err) =>
      console.warn('Falha ao salvar limiares', err)
    );
  }, [state.thresholds, state.hydrated]);

  // ---- Persistencia: historico de alertas ----
  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.ALERT_HISTORY, JSON.stringify(state.alerts)).catch((err) =>
      console.warn('Falha ao salvar alertas', err)
    );
  }, [state.alerts, state.hydrated]);

  // ---------------- API exposta ----------------
  const setThreshold = useCallback((metricId, level, value) => {
    dispatch({ type: 'SET_THRESHOLD', metricId, level, value });
  }, []);

  const resetThresholds = useCallback(() => dispatch({ type: 'RESET_THRESHOLDS' }), []);
  const clearAlerts = useCallback(() => dispatch({ type: 'CLEAR_ALERTS' }), []);
  const setRunning = useCallback((running) => dispatch({ type: 'SET_RUNNING', running }), []);

  // Nivel atual de cada metrica (derivado das leituras + limiares vigentes).
  const levels = useMemo(() => {
    const out = {};
    for (const m of METRICS) {
      out[m.id] = evaluateLevel(m.id, state.readings[m.id], state.thresholds[m.id]);
    }
    return out;
  }, [state.readings, state.thresholds]);

  // Status agregado da missao (pior nivel entre todas as metricas).
  const missionStatus = useMemo(() => worstLevel(Object.values(levels)), [levels]);

  const value = useMemo(
    () => ({
      hydrated: state.hydrated,
      running: state.running,
      missionClock: state.missionClock,
      readings: state.readings,
      history: state.history,
      thresholds: state.thresholds,
      alerts: state.alerts,
      levels,
      missionStatus,
      setThreshold,
      resetThresholds,
      clearAlerts,
      setRunning,
    }),
    [
      state.hydrated,
      state.running,
      state.missionClock,
      state.readings,
      state.history,
      state.thresholds,
      state.alerts,
      levels,
      missionStatus,
      setThreshold,
      resetThresholds,
      clearAlerts,
      setRunning,
    ]
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMission deve ser usado dentro de MissionProvider');
  }
  return ctx;
}

// Garante que limiares persistidos antigos nao quebrem se o schema evoluir:
// mescla o que veio do storage sobre os defaults.
function mergeThresholds(stored) {
  const out = { ...DEFAULT_THRESHOLDS };
  for (const key of Object.keys(stored)) {
    if (key in out) out[key] = stored[key];
  }
  return out;
}
