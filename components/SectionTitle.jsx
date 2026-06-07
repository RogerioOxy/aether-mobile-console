import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';

// Titulo de secao com icone e linha divisoria (organiza a Visao Geral).
export default function SectionTitle({ title, icon }) {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={styles.row}>
      {icon ? <Ionicons name={icon} size={16} color={c.secondary} /> : null}
      <Text style={[styles.text, { color: c.textMuted }]}>{title}</Text>
      <View style={[styles.line, { backgroundColor: c.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  line: {
    flex: 1,
    height: 1,
  },
});
