import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { levelColor } from '../services/alertEngine';
import { spacing, radius, typography } from '../theme/theme';

// Linha do historico de alertas: metrica, valor no momento, nivel e horario.
export default function AlertItem({ alert }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const color = levelColor(alert.level);

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          borderLeftColor: color,
        },
      ]}
    >
      <Ionicons name="warning" size={20} color={color} style={styles.icon} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: c.text }]}>
          {alert.metricLabel}{' '}
          <Text style={[typography.mono, { color }]}>
            {formatValue(alert.value)} {alert.unit}
          </Text>
        </Text>
        <Text style={[styles.meta, { color: c.textMuted }]}>{formatTime(alert.ts)}</Text>
      </View>
      <View style={[styles.levelTag, { borderColor: color }]}>
        <Text style={[styles.levelText, { color }]}>{alert.level}</Text>
      </View>
    </View>
  );
}

function formatValue(v) {
  if (v == null || Number.isNaN(v)) return '--';
  return Math.abs(v) < 10 ? v.toFixed(2) : Math.abs(v) < 100 ? v.toFixed(1) : Math.round(v).toString();
}

// Formata o ISO timestamp para HH:MM:SS local (resiliente a datas invalidas).
function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR');
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
  levelTag: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
