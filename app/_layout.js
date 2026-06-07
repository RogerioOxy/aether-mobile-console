import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { MissionProvider, useMission } from '../context/MissionContext';
import Loading from '../components/Loading';

// ==========================================================================
// AETHER - Mission Control AI | Global Solution 2026.1 (Space Connect)
// RM561942 - Rogerio Deligi | RM562686 - Maria Fernanda Garavelli Dantas
// ==========================================================================
// Layout RAIZ: monta os Providers globais (Tema + Missao) e o Stack do Expo
// Router. A unica rota do Stack e o grupo (tabs) -- a navegacao principal e
// por abas inferiores. Conceitos das Aulas 7/10 (estado global + navegacao).

function RootContent() {
  const { hydrated: themeHydrated } = useTheme();
  const { hydrated: missionHydrated } = useMission();

  // Espera a hidratacao do tema e da missao para evitar "flash" de UI errada.
  if (!themeHydrated || !missionHydrated) {
    return <Loading message="Inicializando AETHER..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MissionProvider>
          <ThemedStatusBar />
          <RootContent />
        </MissionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
