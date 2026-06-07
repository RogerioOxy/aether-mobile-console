import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// ==========================================================================
// Sparkline - mini-grafico de barras desenhado SEM bibliotecas externas
// ==========================================================================
// Estrategia: cada ponto da serie vira uma <View> (barra vertical) cuja altura
// e proporcional ao valor normalizado na janela [min, max] da propria serie.
// Zero dependencias graficas -> nenhum risco de "nao instalar no prazo".
export default function Sparkline({ data = [], color, height = 44 }) {
  const { theme } = useTheme();
  const barColor = color || theme.colors.primary;

  if (!data.length) {
    return <View style={[styles.wrap, { height }]} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1; // evita divisao por zero em series planas

  return (
    <View style={[styles.wrap, { height }]}>
      {data.map((v, i) => {
        // normaliza 0..1 e garante uma altura minima visivel
        const ratio = (v - min) / span;
        const barHeight = Math.max(3, ratio * (height - 4));
        // key=i e INTENCIONAL aqui: cada barra representa uma POSICAO fixa na
        // janela deslizante (slot 0 = mais antigo ... slot N = mais recente). Os
        // pontos sao numeros crus sem id estavel; usar value como key causaria
        // remount/animacao indevida quando dois ticks tem o mesmo valor. A
        // posicao e a identidade correta para um sparkline de janela fixa.
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: barHeight,
                backgroundColor: barColor,
                opacity: 0.35 + 0.65 * (i / data.length), // mais recente = mais forte
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    minWidth: 2,
  },
});
