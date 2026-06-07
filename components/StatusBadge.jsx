import { View, Text, StyleSheet } from 'react-native';
import { levelColor, levelLabel } from '../services/alertEngine';
import { radius, spacing } from '../theme/theme';

// Badge colorido do nivel de alerta (NOMINAL/ATENCAO/ALERTA/CRITICO).
// Cores conforme a secao 5/6 do spec (Alert Engine).
export default function StatusBadge({ level, size = 'md' }) {
  const color = levelColor(level);
  const small = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '22', // fundo translucido da mesma cor
          borderColor: color,
          paddingVertical: small ? 2 : 4,
          paddingHorizontal: small ? spacing.sm : spacing.md,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color, fontSize: small ? 10 : 12 }]}>
        {levelLabel(level)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
