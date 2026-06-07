import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import MetricGrid from '../../components/MetricGrid';
import { GROUPS } from '../../constants/telemetry';

// ==========================================================================
// Dashboard de ENERGIA (subsistema de energia da AETHER-1)
// ==========================================================================
// Metricas canonicas: bateria (SoC), barramento principal e geracao solar.
export default function EnergiaScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Energia"
        subtitle="Estado da bateria, do barramento principal e da geracao solar."
        icon="flash"
      />
      <MetricGrid group={GROUPS.ENERGY} />
    </Screen>
  );
}
