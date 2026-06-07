import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import SectionTitle from '../../components/SectionTitle';
import MetricGrid from '../../components/MetricGrid';
import { GROUPS } from '../../constants/telemetry';

// ==========================================================================
// Dashboard de SENSORES DE BORDO (subsistema S1)
// ==========================================================================
// Metricas canonicas: temperatura, pressao da cabine e radiacao (secao 4).
// Inclui tambem a Estabilidade Orbital como segundo bloco deste painel para
// dar visibilidade completa do estado fisico da capsula.
export default function SensoresScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Sensores de Bordo"
        subtitle="Telemetria fisica da capsula AETHER-1 (temperatura, pressao, radiacao)."
        icon="thermometer"
      />
      <MetricGrid group={GROUPS.SENSORS} />

      <SectionTitle title={GROUPS.STABILITY} icon="compass" />
      <MetricGrid group={GROUPS.STABILITY} />
    </Screen>
  );
}
