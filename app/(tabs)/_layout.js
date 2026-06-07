import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

// ==========================================================================
// Navegacao principal por Tabs (Expo Router) - AETHER Mobile Console (S6)
// ==========================================================================
// Abas: Visao Geral / Sensores / Energia / Comunicacao / Alertas / Config.
// Cada aba de dashboard agrupa metricas canonicas distintas (secao 4 do spec).
// O header traz o toggle de tema (bonus Dark/Light).
export default function TabsLayout() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopWidth: 1,
          borderTopColor: c.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle color={c.text} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Visao Geral',
          headerTitle: 'AETHER · Mission Control',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sensores"
        options={{
          title: 'Sensores',
          headerTitle: 'Sensores de Bordo',
          tabBarIcon: ({ color }) => <Ionicons name="thermometer" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="energia"
        options={{
          title: 'Energia',
          headerTitle: 'Energia',
          tabBarIcon: ({ color }) => <Ionicons name="flash" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comunicacao"
        options={{
          title: 'Comms',
          headerTitle: 'Comunicacao',
          tabBarIcon: ({ color }) => <Ionicons name="cellular" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          headerTitle: 'Alert Engine',
          tabBarIcon: ({ color }) => <Ionicons name="warning" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          headerTitle: 'Configuracoes',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
