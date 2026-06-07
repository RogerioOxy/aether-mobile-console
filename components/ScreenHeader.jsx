import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMission } from '../context/MissionContext';
import { spacing, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';

// Cabecalho reutilizavel das telas: titulo + subtitulo + status agregado
// da missao (pior nivel entre as metricas) vindo do MissionContext.
export default function ScreenHeader({ title, subtitle, icon = 'planet' }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const { missionStatus } = useMission();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.titleRow}>
          <Ionicons name={icon} size={22} color={c.primary} />
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        </View>
        <StatusBadge level={missionStatus} />
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  title: {
    ...typography.heading,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
});
