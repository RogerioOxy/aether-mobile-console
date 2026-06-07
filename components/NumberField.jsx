import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme/theme';

// Teclado numerico cross-platform: precisamos de sinal negativo (ex.: -90 dBm)
// e separador decimal nas DUAS plataformas.
//   - iOS: 'numbers-and-punctuation' oferece minus e ponto.
//   - Android: 'numeric' ja inclui o '-' e o '.' (o 'numbers-and-punctuation' e
//     iOS-only e cairia no teclado default no Android).
const NUMERIC_KEYBOARD = Platform.select({
  ios: 'numbers-and-punctuation',
  android: 'numeric',
  default: 'numeric',
});

// ==========================================================================
// NumberField - input numerico controlado com validacao inline
// ==========================================================================
// O erro aparece ABAIXO do campo, em vermelho (sem Alert nativo - exigencia
// do brief). A borda fica vermelha quando ha erro. Valor monoespacado para
// combinar com a estetica de telemetria.
export default function NumberField({
  label,
  value,
  onChangeText,
  unit,
  placeholder,
  error,
  hint,
}) {
  const { theme } = useTheme();
  const c = theme.colors;
  const borderColor = error ? c.CRITICO : c.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: c.text }]}>{label}</Text> : null}
      <View style={[styles.inputBox, { backgroundColor: c.inputBg, borderColor }]}>
        <TextInput
          style={[styles.input, typography.mono, { color: c.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.placeholder}
          keyboardType={NUMERIC_KEYBOARD}
          autoCorrect={false}
        />
        {unit ? <Text style={[styles.unit, { color: c.textMuted }]}>{unit}</Text> : null}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: c.CRITICO }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: c.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs + 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  unit: {
    fontSize: 13,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
  hint: {
    fontSize: 11,
    marginTop: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
});
