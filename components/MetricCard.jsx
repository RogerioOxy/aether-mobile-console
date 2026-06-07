import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMission } from '../context/MissionContext';
import { levelColor } from '../services/alertEngine';
import { spacing, radius, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';
import Sparkline from './Sparkline';
import GaugeBar from './GaugeBar';

// ==========================================================================
// MetricCard - card reutilizavel de uma metrica de telemetria
// ==========================================================================
// Le diretamente do MissionContext o valor, o nivel e a serie historica da
// metrica indicada por `metric.id`. Mostra: icone, rotulo, valor monoespacado,
// badge de nivel, gauge (quando aplicavel) e sparkline da serie recente.
export default function MetricCard({ metric }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const { readings, levels, history } = useMission();

  const value = readings[metric.id];
  const level = levels[metric.id];
  const color = levelColor(level);
  const series = history[metric.id] || [];

  // Fracao do gauge: posicao do valor na faixa fisica [min, max] da metrica.
  const fraction = (value - metric.min) / (metric.max - metric.min || 1);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          shadowColor: c.shadow,
          // realce sutil da borda esquerda na cor do nivel (estilo Mission Control)
          borderLeftColor: color,
          borderLeftWidth: 3,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={metric.icon} size={18} color={c.primary} />
          <Text style={[styles.label, { color: c.text }]} numberOfLines={1}>
            {metric.label}
          </Text>
        </View>
        <StatusBadge level={level} size="sm" />
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, typography.mono, { color }]}>
          {formatValue(value)}
        </Text>
        <Text style={[styles.unit, { color: c.textMuted }]}>{metric.unit}</Text>
      </View>

      <GaugeBar fraction={fraction} color={color} />

      <View style={styles.sparkWrap}>
        <Sparkline data={series} color={c.primary} height={36} />
      </View>
    </View>
  );
}

// Formata o numero com 0, 1 ou 2 casas conforme a magnitude.
function formatValue(v) {
  if (v == null || Number.isNaN(v)) return '--';
  const abs = Math.abs(v);
  if (abs < 10) return v.toFixed(2);
  if (abs < 100) return v.toFixed(1);
  return Math.round(v).toString();
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    margin: spacing.xs,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 4,
  },
  sparkWrap: {
    marginTop: spacing.sm,
  },
});
