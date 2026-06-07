import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import MetricGrid from '../../components/MetricGrid';
import { GROUPS } from '../../constants/telemetry';

// ==========================================================================
// Dashboard de COMUNICACAO (enlace de telemetria capsula -> Houston Control)
// ==========================================================================
// Metricas canonicas: sinal (dBm) e latencia do enlace (ms).
export default function ComunicacaoScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Comunicacao"
        subtitle="Qualidade do enlace de telemetria com a base Houston Control."
        icon="cellular"
      />
      <MetricGrid group={GROUPS.COMMS} />
    </Screen>
  );
}
