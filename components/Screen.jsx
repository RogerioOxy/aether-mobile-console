import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';

// Wrapper de tela: fundo tematico + scroll + respeito as areas seguras.
// `scroll` controla se o conteudo rola (telas de dashboard) ou e fixo.
export default function Screen({ children, scroll = true }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.inner, { paddingBottom: insets.bottom + spacing.xl }]}>
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={[styles.flex, { backgroundColor: c.background }]}>{content}</View>;
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: c.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    padding: spacing.lg,
  },
});
