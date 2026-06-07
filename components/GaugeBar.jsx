import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/theme';

// Barra de progresso horizontal (gauge) desenhada com Views simples.
// fraction: 0..1 do preenchimento; color: cor do nivel atual.
export default function GaugeBar({ fraction = 0, color }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const pct = Math.max(0, Math.min(1, fraction));
  return (
    <View style={[styles.track, { backgroundColor: c.borderSoft }]}>
      <View
        style={[
          styles.fill,
          { width: `${pct * 100}%`, backgroundColor: color || c.primary },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
