# AETHER Mobile Console
### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

> ◢ **AETHER — Mission Control AI** · Operadora: Orbital Climate Intelligence (OCI)
> Subsistema **S6 — Mobile Console** da plataforma *Space Connect*.

![Banner do projeto](./assets/screenshots/banner.png)

> _Banner placeholder — substitua por uma imagem tematica do grupo (pode ser gerada com IA). Salve como `assets/screenshots/banner.png`._

---

## 1. Descricao

O **AETHER Mobile Console** e o aplicativo mobile de controle da missao espacial tripulada **AETHER-1**, operada pela Orbital Climate Intelligence (OCI) a partir da base **Houston Control**. Ele monitora, em tempo real simulado, a telemetria de bordo — sensores, energia, comunicacao e estabilidade orbital — e dispara **alertas automaticos por limiar** (NOMINAL/ATENCAO/ALERTA/CRITICO) quando uma metrica sai da faixa segura. O diferencial da solucao do grupo e o **Alert Engine configuravel**: o operador ajusta os limiares de cada metrica na propria interface, com validacao inline, e tudo (limiares, historico de alertas e tema) e persistido no dispositivo.

---

## 2. Equipe

| Nome | RM |
|------|----|
| Rogerio Deligi | RM561942 |
| Maria Fernanda Garavelli Dantas | RM562686 |

---

## 3. Telas do Aplicativo

> Esta secao e **obrigatoria**. Rode o app no Expo Go ou simulador, capture cada tela e salve as imagens em `assets/screenshots/` com os nomes indicados. Os placeholders abaixo ja apontam para os caminhos corretos.

### Visao Geral — Dashboard Principal
![Visao Geral](./assets/screenshots/01-visao-geral.png)

Banner da missao AETHER-1 (status agregado, relogio da missao, contagem de alertas) e as quatro grades de telemetria consolidadas. Botao para pausar/retomar o stream simulado.

### Dashboard de Sensores
![Sensores](./assets/screenshots/02-sensores.png)

Temperatura, pressao da cabine e radiacao, alem do bloco de estabilidade orbital. Cada card mostra valor monoespacado, badge de nivel, gauge e mini-grafico (sparkline) da serie recente.

### Dashboard de Energia
![Energia](./assets/screenshots/03-energia.png)

Bateria (SoC), barramento principal e geracao solar, com indicadores de carga e nivel de alerta.

### Dashboard de Comunicacao
![Comunicacao](./assets/screenshots/04-comunicacao.png)

Sinal (dBm) e latencia do enlace de telemetria com Houston Control.

### Alertas — Alert Engine
![Alertas](./assets/screenshots/05-alertas.png)

Painel "Ativos agora" (metricas fora do NOMINAL) e historico persistido dos alertas disparados, com nivel de criticidade e horario.

### Configuracoes / Formulario
![Configuracoes](./assets/screenshots/06-config.png)

Formulario de configuracao dos limiares de alerta com **validacao inline** (sem alert nativo), toggle de tema e identificacao do projeto.

### Tema Claro (Dark/Light)
![Tema Claro](./assets/screenshots/07-tema-claro.png)

Mesmo console no tema claro "Daylight Ops" — demonstra o diferencial Dark Mode com preferencia persistida.

---

## 4. Funcionalidades

- [x] Navegacao com **Expo Router** (Tabs): Visao Geral, Sensores, Energia, Comunicacao, Alertas, Configuracoes
- [x] **3+ dashboards distintos** (Sensores, Energia, Comunicacao, Estabilidade Orbital) com cards, gauges e sparklines
- [x] Dados **simulados** por gerador mock com `setInterval` (random walk + anomalias controladas)
- [x] Estado global com **Context API**: `MissionContext` + `ThemeContext`, consumidos em multiplas telas
- [x] **useReducer** no MissionContext para o estado da missao (leituras, limiares, alertas, relogio)
- [x] **AsyncStorage**: persiste limiares de alerta, historico de alertas e preferencia de tema
- [x] **Formulario** de configuracao de limiares com validacao inline e feedback de erro (sem `Alert`)
- [x] **Sistema de Alertas** por limiar (NOMINAL/ATENCAO/ALERTA/CRITICO) exibido na UI
- [x] Tema espacial **dark** + toggle **Dark/Light** (bonus)
- [x] Componentes reutilizaveis e codigo organizado por responsabilidade

---

## 5. Tecnologias

- **React Native** + **Expo** (SDK 55)
- **Expo Router** (navegacao por Tabs + Stack)
- **AsyncStorage** (`@react-native-async-storage/async-storage`)
- **Context API** + `useReducer` / `useState` / `useEffect` (estado global)
- `@expo/vector-icons` (Ionicons)
- `react-native-safe-area-context` (areas seguras)
- JavaScript (sem dependencias graficas externas — graficos e indicadores sao componentes proprios)

> Nenhuma biblioteca de grafico externa foi usada: os sparklines e gauges sao desenhados com `View` para garantir que o app **rode de primeira**, sem risco de instalacao.

---

## 6. Como Executar

### Pre-requisitos
- [Node.js](https://nodejs.org/) v20 ou superior
- [Expo Go](https://expo.dev/go) no celular (Android/iOS) **ou** um emulador
- Expo SDK 55

### Instalacao

```bash
# 1. Clone o repositorio
git clone https://github.com/RogerioOxy/aether-mobile-console.git

# 2. Entre na pasta do projeto
cd aether-mobile-console

# 3. Instale as dependencias
npm install

# 4. Inicie o projeto
npx expo start
```

5. Escaneie o QR Code com o **Expo Go**:
   - **Android**: abra o Expo Go e escaneie diretamente.
   - **iOS**: use a camera nativa e toque no link.

> Se o Expo reclamar de alguma versao, rode `npx expo install` para alinhar as dependencias ao SDK.

---

## 7. Video de Demonstracao

[![Assista ao video](./assets/screenshots/01-visao-geral.png)](https://youtube.com/...)

> **[Substituir pelo link do YouTube (nao listado) ou Google Drive (visivel para qualquer pessoa com o link)]**

O video (ate 3 min) demonstra: visao geral da missao, os tres dashboards, o disparo de alertas, o formulario de limiares com validacao e o toggle de tema.

---

## 8. Licenca

Este projeto foi desenvolvido para fins academicos — **FIAP 2026**.

---

**Disciplina:** Cross-Platform Application Development
**Tema:** Space Predictive Analytics / AETHER — Mission Control AI (Space Connect)
**Curso:** Ciencia da Computacao — 2o Ano
**Instituicao:** FIAP — 2026
**Integrantes:** Rogerio Deligi (RM561942) e Maria Fernanda Garavelli Dantas (RM562686)
