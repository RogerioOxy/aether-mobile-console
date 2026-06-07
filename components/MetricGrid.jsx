import { View, StyleSheet } from 'react-native';
import { METRICS } from '../constants/telemetry';
import MetricCard from './MetricCard';
import { spacing } from '../theme/theme';

// Grade responsiva de MetricCards filtrada por grupo (dashboard).
// Recebe `group` (rotulo do GROUPS) e renderiza as metricas daquele grupo.
export default function MetricGrid({ group }) {
  const metrics = METRICS.filter((m) => m.group === group);
  return (
    <View style={styles.grid}>
      {metrics.map((m) => (
        <MetricCard key={m.id} metric={m} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
});
