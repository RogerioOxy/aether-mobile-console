import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { GROUPS } from '../../constants/telemetry';
import { spacing, radius } from '../../theme/theme';
import Screen from '../../components/Screen';
import MissionBanner from '../../components/MissionBanner';
import SectionTitle from '../../components/SectionTitle';
import MetricGrid from '../../components/MetricGrid';
import AppButton from '../../components/AppButton';

// ==========================================================================
// Tela VISAO GERAL (home) - dashboard consolidado da missao AETHER-1
// ==========================================================================
// Mostra o banner da missao, um controle para pausar/retomar o gerador mock e
// as 4 grades de telemetria (Sensores, Energia, Comunicacao, Estabilidade).
// Consome o MissionContext e o ThemeContext (estado global em multiplas telas).
export default function VisaoGeralScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { running, setRunning, missionStatus } = useMission();

  return (
    <Screen>
      <MissionBanner />

      {/* Controle do stream de telemetria simulada */}
      <View style={[styles.controlRow, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.controlInfo}>
          <Ionicons
            name={running ? 'radio' : 'pause-circle'}
            size={18}
            color={running ? c.NOMINAL : c.textMuted}
          />
          <Text style={[styles.controlText, { color: c.text }]}>
            Telemetria {running ? 'ao vivo (simulada)' : 'pausada'}
          </Text>
        </View>
        <View style={styles.controlBtn}>
          <AppButton
            label={running ? 'Pausar' : 'Retomar'}
            icon={running ? 'pause' : 'play'}
            variant={running ? 'ghost' : 'primary'}
            onPress={() => setRunning(!running)}
          />
        </View>
      </View>

      <SectionTitle title={GROUPS.SENSORS} icon="thermometer" />
      <MetricGrid group={GROUPS.SENSORS} />

      <SectionTitle title={GROUPS.ENERGY} icon="flash" />
      <MetricGrid group={GROUPS.ENERGY} />

      <SectionTitle title={GROUPS.COMMS} icon="cellular" />
      <MetricGrid group={GROUPS.COMMS} />

      <SectionTitle title={GROUPS.STABILITY} icon="compass" />
      <MetricGrid group={GROUPS.STABILITY} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  controlText: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  controlBtn: {
    minWidth: 120,
  },
});
