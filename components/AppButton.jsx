import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/theme';

// Botao reutilizavel com variantes (primary/secondary/danger/ghost).
export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}) {
  const { theme } = useTheme();
  const c = theme.colors;

  const bg = {
    primary: c.primary,
    secondary: c.secondary,
    danger: c.CRITICO,
    ghost: 'transparent',
  }[variant];

  const fg =
    variant === 'ghost' ? c.primary : variant === 'secondary' ? c.textInverse : c.textInverse;

  const borderColor = variant === 'ghost' ? c.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'ghost' ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} style={styles.icon} /> : null}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
