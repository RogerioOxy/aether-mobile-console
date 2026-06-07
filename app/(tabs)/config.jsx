import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import SectionTitle from '../../components/SectionTitle';
import ThresholdEditor from '../../components/ThresholdEditor';
import AppButton from '../../components/AppButton';
import ThemeToggle from '../../components/ThemeToggle';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { CONFIGURABLE_METRICS } from '../../constants/telemetry';
import { spacing, radius } from '../../theme/theme';

// ==========================================================================
// Tela CONFIGURACOES - formulario de limiares + tema + identificacao
// ==========================================================================
// - Edita os limiares de alerta de cada metrica configuravel (validacao inline).
// - Persiste via MissionContext (que grava em AsyncStorage).
// - Toggle de tema (Dark/Light) e botao de restaurar padroes.
// - Rodape com a identificacao canonica da dupla (secao 1 do spec).
export default function ConfigScreen() {
  const { theme, mode } = useTheme();
  const c = theme.colors;
  const { thresholds, setThreshold, resetThresholds } = useMission();

  // Recebe os limiares ja validados e os aplica nivel a nivel no estado global.
  const handleSave = (metricId, parsed) => {
    for (const level of ['atencao', 'alerta', 'critico']) {
      if (typeof parsed[level] === 'number') {
        setThreshold(metricId, level, parsed[level]);
      }
    }
  };

  return (
    <Screen>
      <ScreenHeader
        title="Configuracoes"
        subtitle="Ajuste os limiares do Alert Engine, o tema e veja a identificacao do projeto."
        icon="settings"
      />

      {/* Bloco de tema */}
      <SectionTitle title="Aparencia" icon="color-palette" />
      <View style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.rowInfo}>
          <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={20} color={c.primary} />
          <View>
            <Text style={[styles.rowTitle, { color: c.text }]}>
              Tema {mode === 'dark' ? 'Escuro (Mission Control)' : 'Claro (Daylight Ops)'}
            </Text>
            <Text style={[styles.rowSub, { color: c.textMuted }]}>
              Preferencia salva no dispositivo.
            </Text>
          </View>
        </View>
        <ThemeToggle color={c.primary} />
      </View>

      {/* Bloco de limiares */}
      <SectionTitle title="Limiares de Alerta" icon="options" />
      <Text style={[styles.note, { color: c.textMuted }]}>
        Valores padrao seguem o spec canonico AETHER. As alteracoes sao validadas e persistidas.
      </Text>

      {CONFIGURABLE_METRICS.map((metric) => (
        <ThresholdEditor
          key={metric.id}
          metric={metric}
          currentThresholds={thresholds[metric.id]}
          onSave={handleSave}
        />
      ))}

      <View style={styles.resetBtn}>
        <AppButton
          label="Restaurar limiares padrao"
          icon="refresh"
          variant="secondary"
          onPress={resetThresholds}
        />
      </View>

      {/* Identificacao do projeto / dupla */}
      <SectionTitle title="Sobre a Missao" icon="information-circle" />
      <View style={[styles.about, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.aboutBrand, { color: c.primary }]}>◢ AETHER — Mission Control AI</Text>
        <Text style={[styles.aboutLine, { color: c.textMuted }]}>
          Global Solution 2026.1 · Space Connect
        </Text>
        <Text style={[styles.aboutLine, { color: c.textMuted }]}>
          Operadora: Orbital Climate Intelligence (OCI)
        </Text>
        <Text style={[styles.aboutLine, { color: c.textMuted }]}>
          Subsistema S6 — Mobile Console · Cross-Platform Application Development
        </Text>
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <Text style={[styles.aboutTeam, { color: c.text }]}>RM561942 — Rogerio Deligi</Text>
        <Text style={[styles.aboutTeam, { color: c.text }]}>
          RM562686 — Maria Fernanda Garavelli Dantas
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 11,
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    marginBottom: spacing.md,
  },
  resetBtn: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  about: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  aboutBrand: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  aboutLine: {
    fontSize: 12,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  aboutTeam: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
});
