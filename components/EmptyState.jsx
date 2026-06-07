import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';

// Estado vazio reutilizavel (ex.: nenhum alerta no historico).
export default function EmptyState({ icon = 'checkmark-circle', title, message }) {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={48} color={c.textMuted} />
      {title ? <Text style={[styles.title, { color: c.text }]}>{title}</Text> : null}
      {message ? <Text style={[styles.message, { color: c.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
