import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThresholdForm } from '../hooks/useThresholdForm';
import { STATUS_COLORS } from '../theme/theme';
import { spacing, radius } from '../theme/theme';
import NumberField from './NumberField';
import AppButton from './AppButton';

// ==========================================================================
// ThresholdEditor - formulario de limiares de UMA metrica configuravel
// ==========================================================================
// Usa o hook useThresholdForm para validacao inline (sem Alert nativo).
// Ao salvar, valida e -- se ok -- chama onSave(metricId, { atencao, alerta,
// critico }). Mostra feedback de sucesso/erro abaixo do botao.
const LEVEL_META = [
  { key: 'atencao', label: 'ATENCAO', color: STATUS_COLORS.ATENCAO },
  { key: 'alerta', label: 'ALERTA', color: STATUS_COLORS.ALERTA },
  { key: 'critico', label: 'CRITICO', color: STATUS_COLORS.CRITICO },
];

export default function ThresholdEditor({ metric, currentThresholds, onSave }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const { values, errors, setField, validate } = useThresholdForm(metric.id, currentThresholds);
  const [feedback, setFeedback] = useState(null); // { ok, message }

  // Limpa o feedback ("Limiares salvos") quando os limiares vigentes mudam por
  // FORA deste editor — ex.: "Restaurar limiares padrao" (RESET_THRESHOLDS) ou
  // hidratacao tardia do AsyncStorage. Sem isto, a mensagem verde de sucesso
  // ficaria visivel mesmo depois de os campos terem sido re-sincronizados.
  //
  // PORÉM, o proprio "Salvar limiares" tambem muda currentThresholds (via onSave
  // -> setThreshold). Esse caso NÃO deve apagar a mensagem de sucesso recem-exibida.
  // Distinguimos os dois com selfSaveRef: handleSave marca a proxima mudanca como
  // "nossa"; o efeito so limpa o feedback quando a mudanca veio de fora.
  const selfSaveRef = useRef(false);
  useEffect(() => {
    if (selfSaveRef.current) {
      selfSaveRef.current = false; // consome o save proprio, preserva o feedback
      return;
    }
    setFeedback(null);
  }, [currentThresholds]);

  const directionHint =
    metric.direction === 'below'
      ? 'Piora ao CAIR: ATENCAO > ALERTA > CRITICO.'
      : 'Piora ao SUBIR: ATENCAO < ALERTA < CRITICO.';

  const handleSave = () => {
    const { ok, parsed } = validate();
    if (!ok) {
      setFeedback({ ok: false, message: 'Corrija os campos destacados antes de salvar.' });
      return;
    }
    selfSaveRef.current = true; // a mudanca de currentThresholds a seguir e nossa
    onSave(metric.id, parsed);
    setFeedback({ ok: true, message: 'Limiares salvos e persistidos.' });
  };

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={styles.header}>
        <Ionicons name={metric.icon} size={18} color={c.primary} />
        <Text style={[styles.title, { color: c.text }]}>
          {metric.label} <Text style={{ color: c.textMuted }}>[{metric.unit}]</Text>
        </Text>
      </View>
      <Text style={[styles.hint, { color: c.textMuted }]}>{directionHint}</Text>

      {LEVEL_META.filter((lvl) => values[lvl.key] !== undefined).map((lvl) => (
        <NumberField
          key={lvl.key}
          label={lvl.label}
          value={values[lvl.key]}
          onChangeText={(t) => setField(lvl.key, t)}
          unit={metric.unit}
          placeholder={`Limiar de ${lvl.label.toLowerCase()}`}
          error={errors[lvl.key]}
        />
      ))}

      {errors._order ? (
        <View style={[styles.orderError, { backgroundColor: c.CRITICO + '18' }]}>
          <Ionicons name="alert-circle" size={14} color={c.CRITICO} />
          <Text style={[styles.orderErrorText, { color: c.CRITICO }]}>{errors._order}</Text>
        </View>
      ) : null}

      <AppButton label="Salvar limiares" icon="save" onPress={handleSave} />

      {feedback ? (
        <View style={styles.feedbackRow}>
          <Ionicons
            name={feedback.ok ? 'checkmark-circle' : 'close-circle'}
            size={15}
            color={feedback.ok ? c.NOMINAL : c.CRITICO}
          />
          <Text
            style={[styles.feedbackText, { color: feedback.ok ? c.NOMINAL : c.CRITICO }]}
          >
            {feedback.message}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    marginBottom: spacing.md,
  },
  orderError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  orderErrorText: {
    fontSize: 12,
    flexShrink: 1,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
