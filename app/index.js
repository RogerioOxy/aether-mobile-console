import { Redirect } from 'expo-router';

// Rota raiz "/" -> redireciona para o grupo de abas (tabs).
// Garante que o app sempre abra direto na Visao Geral, sem tela em branco.
// (Mesmo padrao usado no CP2 da dupla, sem o gate de autenticacao.)
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
