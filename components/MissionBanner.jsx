import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMission } from '../context/MissionContext';
import { levelColor } from '../services/alertEngine';
import { spacing, radius, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';

// Banner de cabecalho da Visao Geral: logomarca textual AETHER, tagline,
// status agregado da missao e o "relogio da missao" (ticks do gerador mock).
export default function MissionBanner() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { missionStatus, missionClock, alerts } = useMission();
  const statusColor = levelColor(missionStatus);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border, shadowColor: c.shadow },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <Ionicons name="planet" size={26} color={c.primary} />
          <View>
            <Text style={[styles.brand, { color: c.text }]}>◢ AETHER</Text>
            <Text style={[styles.sub, { color: c.textMuted }]}>Mission Control AI · OCI</Text>
          </View>
        </View>
        <StatusBadge level={missionStatus} />
      </View>

      <Text style={[styles.tagline, { color: c.secondary }]}>
        Do espaco, cuidando da Terra.
      </Text>

      <View style={[styles.statsRow, { borderTopColor: c.border }]}>
        <Stat
          label="MISSAO"
          value="AETHER-1"
          color={c.text}
          c={c}
          icon="rocket"
        />
        <Stat
          label="STATUS"
          value={missionStatus}
          color={statusColor}
          c={c}
          icon="pulse"
        />
        <Stat
          label="ALERTAS"
          value={String(alerts.length)}
          color={c.text}
          c={c}
          icon="warning"
        />
        <Stat
          label="TICK"
          value={String(missionClock)}
          color={c.text}
          c={c}
          icon="time"
        />
      </View>
    </View>
  );
}

function Stat({ label, value, color, c, icon }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={14} color={c.textMuted} />
      <Text style={[styles.statValue, typography.mono, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: c.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sub: {
    fontSize: 11,
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
