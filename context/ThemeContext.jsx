import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/theme';
import { STORAGE_KEYS } from '../constants/storageKeys';

// ==========================================================================
// ThemeContext - tema espacial Mission Control (dark) + toggle Dark/Light
// ==========================================================================
// Distribui o objeto de tema (cores) para todo o app via useTheme() e
// persiste a preferencia do operador em AsyncStorage. O tema PADRAO e o
// escuro (estetica de controle de missao do spec).
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark'); // padrao: tema espacial escuro
  const [hydrated, setHydrated] = useState(false);

  // Hidrata a preferencia salva ao montar.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (stored === 'dark' || stored === 'light') {
          setMode(stored);
        }
      } catch (err) {
        console.warn('Falha ao ler preferencia de tema', err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch (err) {
      console.warn('Falha ao salvar preferencia de tema', err);
    }
  };

  const value = useMemo(
    () => ({
      theme: mode === 'dark' ? darkTheme : lightTheme,
      mode,
      toggleTheme,
      hydrated,
    }),
    [mode, hydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
