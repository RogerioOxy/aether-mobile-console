import { useState, useEffect, useRef, useCallback } from 'react';
import { getMetric } from '../constants/telemetry';

// ==========================================================================
// useThresholdForm - logica de validacao do formulario de limiares
// ==========================================================================
// Mantem os valores em texto (como o usuario digita) e produz erros inline.
// Regras de validacao:
//   1. Campo obrigatorio nao pode ficar vazio.
//   2. Deve ser numero valido.
//   3. A ordenacao dos niveis deve respeitar a DIRECAO da metrica:
//      - 'above' (piora subindo): atencao < alerta < critico
//      - 'below' (piora caindo):  atencao > alerta > critico
//   Niveis 'null' (nao aplicaveis a essa metrica) sao ignorados.
//
// Retorna { values, errors, setField, validate, isDirty }.

// Converte virgula decimal -> ponto e tenta parsear.
function parseNum(text) {
  if (text == null) return NaN;
  const normalized = String(text).trim().replace(',', '.');
  if (normalized === '') return NaN;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function useThresholdForm(metricId, currentThresholds) {
  const metric = getMetric(metricId);

  // Inicializa os campos a partir dos limiares atuais (apenas niveis aplicaveis).
  const buildInitial = () => {
    const t = currentThresholds || {};
    const out = {};
    for (const level of ['atencao', 'alerta', 'critico']) {
      if (t[level] !== null && t[level] !== undefined) {
        out[level] = String(t[level]);
      }
    }
    return out;
  };

  const [values, setValues] = useState(buildInitial);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Re-sincronizacao dos campos com os limiares vigentes.
  // useState(buildInitial) so le currentThresholds na MONTAGEM. Sem isto, dois
  // cenarios deixariam os inputs com texto "velho" (stale) mesmo apos o estado
  // global mudar:
  //   1. "Restaurar limiares padrao" (RESET_THRESHOLDS no MissionContext) — o
  //      Alert Engine ja usa os defaults, mas os campos continuariam editados.
  //   2. Hidratacao do AsyncStorage que conclui DEPOIS da 1a render do editor.
  // Comparamos por conteudo serializado (nao por referencia) para so re-sincronizar
  // quando os limiares realmente mudam, sem sobrescrever a digitacao do usuario a
  // cada nova referencia de objeto vinda do Context.
  const lastSyncedRef = useRef(JSON.stringify(currentThresholds ?? null));
  useEffect(() => {
    const incoming = JSON.stringify(currentThresholds ?? null);
    if (incoming === lastSyncedRef.current) return;
    lastSyncedRef.current = incoming;
    setValues(buildInitial());
    setErrors({});
    setIsDirty(false);
    // buildInitial depende apenas de currentThresholds; a dep abaixo cobre a re-sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentThresholds]);

  const setField = useCallback((level, text) => {
    setValues((prev) => ({ ...prev, [level]: text }));
    setIsDirty(true);
    // limpa o erro do campo enquanto o usuario corrige (feedback imediato)
    setErrors((prev) => ({ ...prev, [level]: undefined, _order: undefined }));
  }, []);

  // Valida tudo. Retorna { ok, parsed } e popula errors.
  const validate = useCallback(() => {
    const newErrors = {};
    const parsed = {};
    const levels = Object.keys(values); // apenas os niveis aplicaveis

    for (const level of levels) {
      const n = parseNum(values[level]);
      if (values[level] == null || String(values[level]).trim() === '') {
        newErrors[level] = 'Campo obrigatorio.';
      } else if (Number.isNaN(n)) {
        newErrors[level] = 'Informe um numero valido.';
      } else {
        parsed[level] = n;
      }
    }

    // Validacao de ordenacao (apenas se todos os campos individuais sao validos).
    if (Object.keys(newErrors).length === 0 && metric) {
      const a = parsed.atencao;
      const al = parsed.alerta;
      const cr = parsed.critico;
      const has = (x) => typeof x === 'number';

      if (metric.direction === 'above') {
        // atencao < alerta < critico
        if (has(a) && has(al) && !(a < al)) {
          newErrors._order = 'ATENCAO deve ser menor que ALERTA.';
        } else if (has(al) && has(cr) && !(al < cr)) {
          newErrors._order = 'ALERTA deve ser menor que CRITICO.';
        }
      } else if (metric.direction === 'below') {
        // atencao > alerta > critico
        if (has(a) && has(al) && !(a > al)) {
          newErrors._order = 'ATENCAO deve ser maior que ALERTA.';
        } else if (has(al) && has(cr) && !(al > cr)) {
          newErrors._order = 'ALERTA deve ser maior que CRITICO.';
        }
      }
    }

    setErrors(newErrors);
    return { ok: Object.keys(newErrors).length === 0, parsed };
  }, [values, metric]);

  return { values, errors, setField, validate, isDirty };
}
