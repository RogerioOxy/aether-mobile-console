// Chaves do AsyncStorage centralizadas (subsistema S6 - Mobile Console).
// Evita strings magicas espalhadas pelo codigo e facilita troca/limpeza.
// Namespace "@aether" para isolar os dados do AETHER Mobile Console.
export const STORAGE_KEYS = {
  THEME: '@aether:theme',           // preferencia de tema (dark/light)
  THRESHOLDS: '@aether:thresholds', // limiares de alerta configurados pelo operador
  ALERT_HISTORY: '@aether:alerts',  // historico dos alertas disparados
};
