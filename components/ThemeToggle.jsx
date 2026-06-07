import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Botao de alternancia Dark/Light (bonus do spec). Mostra o icone do tema
// PARA O QUAL vai alternar, deixando a acao clara para o operador.
export default function ThemeToggle({ color }) {
  const { mode, toggleTheme } = useTheme();
  const icon = mode === 'dark' ? 'sunny' : 'moon';
  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10}
      style={styles.btn}
      accessibilityLabel="Alternar tema claro e escuro"
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
