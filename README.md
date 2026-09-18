# ALIEN TERMINAL

Um jogo de sobrevivência em terminal inspirado em interfaces de computador retrofuturistas e no universo de ficção científica de *Alien*. Desenvolvido com React e Vite, o projeto combina uma interface comandada por texto, um mapa esquemático da nave e uma simulação baseada em turnos, na qual uma forma de vida desconhecida se movimenta de forma independente do jogador.

> **Objetivo:** sobreviver por 30 turnos.

## Ficha Técnica

| Categoria | Detalhes |
|---|---|
| **Tipo de projeto** | Jogo de sobrevivência / estratégia para navegador |
| **Frontend** | React 19 |
| **Build** | Vite 8 |
| **Linguagem** | JavaScript (ES Modules) |
| **Estilização** | CSS |
| **Gerenciamento de estado** | React `useState` / `useEffect` |
| **Engine do jogo** | Simulação customizada em JavaScript |
| **Renderização** | Componentes React + conexões SVG no mapa |
| **Entrada do jogador** | Interface de comandos em terminal |
| **Interface responsiva** | Desktop e dispositivos móveis |
| **Backend** | Não possui |
| **Persistência de dados** | Não possui — cada sessão é gerada em memória |
| **Objetivo de sobrevivência** | 30 turnos |
| **Deploy** | Cloudflare Workers |

## Conceito

O jogador está a bordo de uma nave USCSS após o despertar do sono criogênico. A tripulação está morta, uma forma de vida desconhecida circula pela nave e um sinal automático de emergência já foi enviado.

O jogador não controla diretamente um personagem nem percorre fisicamente a nave. Todas as decisões são tomadas através do terminal de bordo.

A experiência é construída em torno de **informação, previsão e gerenciamento de recursos**:

- Rastrear a forma de vida através do RADAR.
- Usar o mapa para analisar possíveis rotas.
- Bloquear temporariamente conexões entre salas.
- Utilizar dispositivos de som para redirecionar a criatura.
- Monitorar acessos à ventilação e a rede de dutos.
- Usar STEAM para tentar expulsar a criatura dos dutos.
- Administrar os turnos cuidadosamente até completar a missão.

## Jogabilidade

### Sistema de turnos

O jogo utiliza um sistema de turnos discretos.

- A sessão começa no turno 1.
- O objetivo é sobreviver até o turno 30.
- A maioria dos comandos operacionais válidos consome um turno.
- Comandos inválidos não consomem turno.
- `HELP` não consome turno.
- `MAP` não consome turno.
- Após um comando operacional válido, a forma de vida normalmente recebe uma oportunidade de movimento.
- Ao atingir o limite de sobrevivência, a missão é concluída.

Isso faz com que o jogador precise considerar não apenas **qual** comando utilizar, mas também **quando** utilizá-lo.

### Mapa da nave

A nave é representada como um grafo de salas conectadas.

Salas atuais:

- BRIDGE
- CRYO
- HUB
- MESS
- GALLEY
- MEDBAY
- CARGO
- AIRLOCK
- ENGINEERING
- MACHINE SHOP
- LANDING BAY

As conexões são definidas em `src/game/rooms.js`. O componente do mapa utiliza a mesma estrutura de salas usada pela engine, mantendo a representação visual sincronizada com a topologia da simulação.

O mapa pode exibir:

- Localização do jogador
- Último contato conhecido pelo RADAR
- Conexões bloqueadas
- Bateria dos bloqueios
- Dispositivos de som
- Pontos de acesso à ventilação

Abrir o mapa é uma ação informativa e não avança o turno.

## IA e Movimento da Forma de Vida

A forma de vida é simulada inteiramente no cliente através da engine customizada do jogo.

### Movimento normal

Durante o movimento normal, a forma de vida:

- Pode atravessar salas conectadas.
- Move-se no máximo uma sala por oportunidade de movimento.
- Pode permanecer na sala atual.
- Respeita conexões bloqueadas.
- Pode entrar no sistema de ventilação dependendo da sala e de suas saídas.

O jogador **não recebe rastreamento contínuo**. O RADAR representa o último contato conhecido, e não necessariamente a localização atual.

### Conexões bloqueadas

Durante o movimento normal, a forma de vida não escolhe automaticamente outra rota caso selecione uma conexão bloqueada.

Quando isso acontece:

1. O terminal registra a movimentação.
2. A criatura tenta atravessar a porta.
3. A conexão permanece bloqueada.
4. A criatura permanece na sala atual naquela oportunidade de movimento.

Isso permite utilizar os bloqueios para manipular temporariamente o deslocamento da ameaça sem controlá-la completamente.

## Sistema de Bloqueio de Portas

Os bloqueios são criados através do comando:

`LOCK [SALA] [SALA]`

Exemplo:

`LOCK CARGO AIRLOCK`

Somente conexões diretamente adjacentes podem ser bloqueadas.

Cada bloqueio:

- Começa com 3 unidades de bateria.
- Mantém 3 unidades durante o turno em que foi criado.
- Perde bateria nos turnos seguintes.
- Expira quando a bateria chega a zero.
- É controlado independentemente dos outros bloqueios.

A engine utiliza uma chave normalizada para representar o par de salas, garantindo que a mesma conexão seja identificada corretamente independentemente da ordem utilizada no comando.

Por exemplo:

`LOCK CARGO AIRLOCK`

e

`LOCK AIRLOCK CARGO`

representam a mesma conexão física.

## RADAR

O RADAR funciona como um sistema de **última localização conhecida**, e não como rastreamento contínuo.

Quando uma varredura encontra a forma de vida:

- A posição mais recente é registrada.
- O contato é exibido no mapa.
- A criatura pode se mover depois da varredura.
- O jogador precisa utilizar a topologia do mapa para analisar para onde ela pode ter ido.

Quando a criatura entra na ventilação:

`NO CONTACT DETECTED.`

A perda do contato não significa que a criatura desapareceu.

## Sistema de Ventilação

Entre 1 e 3 pontos de acesso à ventilação são gerados aleatoriamente no início de cada sessão.

Todos os pontos fazem parte de uma **única rede de ventilação compartilhada**.

### Entrada na ventilação

Quando a forma de vida entra em uma sala com acesso à ventilação:

- **40% de chance** de entrar nos dutos quando pelo menos uma saída está desbloqueada.
- **80% de chance** quando todas as saídas estão bloqueadas.

Isso cria uma relação de risco entre os sistemas: bloquear completamente uma sala pode aumentar a probabilidade de a criatura utilizar a ventilação.

### Estado oculto

Enquanto estiver na ventilação:

- A criatura não possui uma sala atual.
- `alienRoom` passa a ser `null`.
- O RADAR não consegue detectá-la.
- O movimento normal entre salas é suspenso.

A cada oportunidade de movimento enquanto estiver escondida:

- **75% de chance** de permanecer na ventilação.
- **25% de chance** de sair por um ponto de ventilação escolhido aleatoriamente.

A sala de saída não precisa ser a mesma sala pela qual a criatura entrou.

### STEAM

O comando `STEAM` tenta forçar uma criatura escondida a sair da ventilação.

- Consome um turno.
- Possui **30% de chance de sucesso**.
- Em caso de sucesso, a criatura sai por um ponto de ventilação aleatório.
- O terminal confirma apenas que o sistema foi ativado.
- O jogador não recebe confirmação sobre o sucesso da tentativa.
- O RADAR pode ser utilizado depois para tentar recuperar informações.

## Dispositivos de Som

Cada sessão gera entre **1 e 5 dispositivos de som** em salas diferentes.

Comando:

`SOUND [SALA]`

Exemplo:

`SOUND CARGO`

Quando um dispositivo válido é ativado:

1. O comando consome um turno.
2. O movimento aleatório normal é substituído naquela oportunidade.
3. A criatura passa a perseguir a fonte sonora.
4. A engine calcula uma rota até o dispositivo.
5. Bloqueios não oferecem a mesma proteção durante a perseguição sonora.
6. A criatura pode atravessar conexões bloqueadas quando necessário.
7. Se a rota passar pela sala do jogador, a criatura não o ataca automaticamente durante essa perseguição.
8. Ao alcançar o dispositivo, ele é destruído.

Os dispositivos de som funcionam, portanto, como um recurso limitado para manipular deliberadamente a posição da ameaça.

O mapa mostra os dispositivos ativos e remove os dispositivos destruídos.

## Pathfinding

A engine possui uma rotina própria de busca de caminhos utilizada durante a perseguição sonora.

A escolha de rota prioriza:

1. Menor quantidade de conexões bloqueadas.
2. Menor distância.

O resultado do cálculo inclui tanto o caminho selecionado quanto as conexões bloqueadas que precisarão ser atravessadas.

Isso mantém separados os comportamentos de **movimento normal** e **perseguição direcionada por som**.

## Comandos

| Comando | Função | Consome turno |
|---|---|---:|
| `HELP` | Exibe os comandos disponíveis | Não |
| `STATUS` | Mostra turno, localização, dispositivos de som e bloqueios ativos | Sim |
| `LOOK` | Inspeciona a sala atual e suas saídas | Sim |
| `RADAR` | Procura o último contato conhecido da criatura | Sim |
| `MAP` | Abre o mapa esquemático da nave | Não |
| `LOCK [SALA] [SALA]` | Bloqueia uma conexão adjacente | Sim |
| `SOUND [SALA]` | Ativa um dispositivo de som | Sim |
| `STEAM` | Tenta expulsar a criatura da ventilação | Sim |

## Estado do Jogo

A engine mantém o estado da sessão em um único objeto contendo informações como:

- `playerRoom`
- `alienRoom`
- `alienState`
- `turn`
- `maxTurns`
- `radarRoom`
- `radarActive`
- `locks`
- `newLock`
- `soundDevices`
- `activeSound`
- `vents`
- `gameOver`
- `victory`
- `logs`

A forma de vida possui atualmente dois estados de movimentação explícitos:

- `normal`
- `inVent`

Essa separação mantém a lógica da simulação independente da camada de apresentação.

## Arquitetura da Aplicação

O projeto utiliza uma arquitetura baseada em componentes React:

```text
alien-terminal/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── alienIcon.png
│   │   └── sound-loud-filled-svgrepo-com.svg
│   │
│   ├── components/
│   │   ├── LoadingScreen.jsx
│   │   ├── Map.jsx
│   │   ├── Menu.jsx
│   │   ├── StatusBar.jsx
│   │   ├── Terminal.jsx
│   │   └── TutorialModal.jsx
│   │
│   ├── game/
│   │   ├── gameEngine.js
│   │   └── rooms.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

### Responsabilidades dos componentes

**App.jsx**

Controla o fluxo principal da aplicação:

- Menu
- Tela de carregamento
- Tela do jogo
- Alternância entre terminal e mapa
- Modal do tutorial
- Sequência de game over
- Reinício da sessão

**Terminal.jsx**

Implementa a interface de comandos:

- Entrada de comandos
- Envio dos comandos
- Exibição dos logs
- Cursor de texto personalizado
- Rolagem automática do terminal
- Acesso ao mapa

**Map.jsx**

Renderiza o esquema da nave utilizando React e SVG:

- Salas
- Conexões físicas
- Marcador do jogador
- Marcador do RADAR
- Indicadores de bloqueio
- Indicadores de bateria
- Dispositivos de som
- Pontos de ventilação

**StatusBar.jsx**

Exibe informações de estado como:

- Localização atual
- Turno
- Status da sessão

**Menu.jsx**

Disponibiliza:

- Novo jogo
- Tutorial

**LoadingScreen.jsx**

Simula a inicialização dos sistemas da nave antes do início da sessão.

**TutorialModal.jsx**

Contém o manual operacional dentro do jogo, explicando as mecânicas e os comandos.

**gameEngine.js**

Concentra a lógica principal da simulação:

- Criação da sessão
- Posicionamento aleatório
- Movimento da criatura
- Pathfinding
- Bloqueios
- RADAR
- Perseguição sonora
- Ventilação
- STEAM
- Progressão de turnos
- Vitória e game over
- Interpretação dos comandos

**rooms.js**

Define a topologia da nave e as conexões entre as salas.

## Randomização

Cada nova sessão gera um estado inicial diferente.

Elementos randomizados:

- Sala inicial do jogador
- Sala inicial da criatura
- Localização dos dispositivos de som
- Localização dos pontos de ventilação

A engine também utiliza decisões aleatórias durante a partida para:

- Movimento da criatura
- Entrada na ventilação
- Permanência nos dutos
- Saída da ventilação
- Sucesso do STEAM
- Eventos atmosféricos e de sistema

Isso impede que uma única sequência fixa de ações seja reutilizada em todas as partidas.

## Design da Interface

A interface foi projetada para reproduzir a sensação de um computador de bordo industrial e retrofuturista.

Principais características:

- Visual inspirado em CRT
- Tipografia monoespaçada
- Paleta monocromática verde
- Scanlines e efeitos de tela
- Estética de terminal industrial
- HUD minimalista
- Mapa esquemático da nave
- Interface responsiva

A proposta é fazer o terminal parecer um sistema funcional da própria nave, em vez de uma interface convencional de videogame.

O layout também possui adaptações para telas menores.

## Objetivos Técnicos

O projeto foi desenvolvido como exercício prático de:

- Arquitetura de componentes React
- Interfaces orientadas por estado
- Lógica de jogos em JavaScript
- Sistemas de movimentação baseados em grafos
- Pathfinding
- Simulações com aleatoriedade
- Interpretação de comandos
- Renderização condicional
- Interfaces baseadas em SVG
- CSS responsivo
- UI/UX
- Separação entre lógica do jogo e apresentação

## Executando Localmente

### Requisitos

- Node.js
- npm

### Instalação

```bash
git clone https://github.com/Richter06/AlienTerminal.git
cd AlienTerminal/alien-terminal
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

### Visualização do build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Dependências

### Runtime

- React
- React DOM

### Desenvolvimento

- Vite
- @vitejs/plugin-react
- ESLint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

O jogo não depende de backend ou banco de dados externo.

## Deploy

O projeto é uma aplicação React executada no lado do cliente e configurada para deploy através da infraestrutura da Cloudflare.

O build de produção do Vite gera os arquivos estáticos que são disponibilizados ao navegador.

## Escopo Atual

A versão atual é centrada no ciclo principal de sobrevivência:

**Observar → Decidir → Executar comando → Avançar turno → Reagir à criatura → Sobreviver**

A arquitetura foi organizada de forma que novos sistemas possam ser adicionados à simulação sem a necessidade de reconstruir a interface do terminal ou o mapa.

## Autor

**Richard R. Araújo**

- GitHub: https://github.com/Richter06
- Repositório: https://github.com/Richter06/AlienTerminal

---

*Projeto independente de desenvolvimento web e jogos.*
