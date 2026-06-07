import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';

// Indicador de carregamento centralizado (usado durante a hidratacao).
export default function Loading({ message = 'Carregando...' }) {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <ActivityIndicator size="large" color={c.primary} />
      <Text style={[styles.text, { color: c.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    fontSize: 14,
  },
});
