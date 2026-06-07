import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import SectionTitle from '../../components/SectionTitle';
import AlertItem from '../../components/AlertItem';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import StatusBadge from '../../components/StatusBadge';
import { useMission } from '../../context/MissionContext';
import { useTheme } from '../../context/ThemeContext';
import { METRICS } from '../../constants/telemetry';
import { levelRank } from '../../services/alertEngine';
import { spacing, radius } from '../../theme/theme';

// ==========================================================================
// Tela ALERTAS (Alert Engine - subsistema S3)
// ==========================================================================
// 1) Painel "Ativos agora": metricas atualmente fora do NOMINAL.
// 2) Historico persistido (AsyncStorage) dos alertas disparados, com botao
//    para limpar. Consome readings/levels/alerts do MissionContext.
export default function AlertasScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { levels, readings, alerts, clearAlerts } = useMission();

  // Metricas atualmente em alerta (nivel diferente de NOMINAL), pior primeiro.
  const active = useMemo(() => {
    return METRICS.filter((m) => levels[m.id] && levels[m.id] !== 'NOMINAL').sort(
      (a, b) => levelRank(levels[b.id]) - levelRank(levels[a.id])
    );
  }, [levels]);

  return (
    <Screen>
      <ScreenHeader
        title="Alert Engine"
        subtitle="Alertas gerados automaticamente por limiar (NOMINAL/ATENCAO/ALERTA/CRITICO)."
        icon="warning"
      />

      <SectionTitle title="Ativos agora" icon="alert-circle" />
      {active.length === 0 ? (
        <View style={[styles.okBox, { backgroundColor: c.surface, borderColor: c.NOMINAL }]}>
          <Ionicons name="checkmark-circle" size={22} color={c.NOMINAL} />
          <Text style={[styles.okText, { color: c.text }]}>
            Todos os sistemas em estado NOMINAL.
          </Text>
        </View>
      ) : (
        active.map((m) => (
          <View
            key={m.id}
            style={[styles.activeRow, { backgroundColor: c.surface, borderColor: c.border }]}
          >
            <Ionicons name={m.icon} size={20} color={c.primary} style={styles.activeIcon} />
            <View style={styles.activeBody}>
              <Text style={[styles.activeTitle, { color: c.text }]}>{m.label}</Text>
              <Text style={[styles.activeValue, { color: c.textMuted }]}>
                {formatValue(readings[m.id])} {m.unit}
              </Text>
            </View>
            <StatusBadge level={levels[m.id]} size="sm" />
          </View>
        ))
      )}

      <View style={styles.historyHeader}>
        <SectionTitle title={`Historico (${alerts.length})`} icon="time" />
      </View>

      {alerts.length === 0 ? (
        <EmptyState
          icon="file-tray"
          title="Sem alertas registrados"
          message="Os alertas disparados pela telemetria simulada aparecerao aqui e ficam salvos no dispositivo."
        />
      ) : (
        <>
          {alerts.map((a) => (
            <AlertItem key={a.id} alert={a} />
          ))}
          <View style={styles.clearBtn}>
            <AppButton
              label="Limpar historico"
              icon="trash"
              variant="ghost"
              onPress={clearAlerts}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

function formatValue(v) {
  if (v == null || Number.isNaN(v)) return '--';
  return Math.abs(v) < 10 ? v.toFixed(2) : Math.abs(v) < 100 ? v.toFixed(1) : Math.round(v).toString();
}

const styles = StyleSheet.create({
  okBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  okText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  activeIcon: {
    marginRight: spacing.md,
  },
  activeBody: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeValue: {
    fontSize: 12,
    marginTop: 2,
  },
  historyHeader: {
    marginTop: spacing.md,
  },
  clearBtn: {
    marginTop: spacing.sm,
  },
});
