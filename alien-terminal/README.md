# ALIEN TERMINAL

A retro-futuristic survival game played entirely through a shipboard computer terminal. Built with React and Vite, the project combines a command-driven interface, a schematic ship map and a turn-based simulation where an unidentified lifeform moves independently of the player.

> **Objective:** survive 30 turns.

## Technical Sheet

| Category | Details |
|---|---|
| **Project type** | Browser survival / strategy game |
| **Frontend** | React 19 |
| **Build tool** | Vite 8 |
| **Language** | JavaScript (ES Modules) |
| **Styling** | CSS |
| **State management** | React `useState` / `useEffect` |
| **Game engine** | Custom JavaScript simulation |
| **Rendering** | React components + SVG map connections |
| **Input** | Terminal command interface |
| **Responsive UI** | Desktop and mobile layouts |
| **Backend** | None |
| **Data persistence** | None — each session is generated in memory |
| **Maximum survival objective** | 30 turns |
| **Deployment** | Cloudflare Workers |

## Concept

The player wakes aboard a USCSS vessel after cryogenic revival. The crew is dead, an unidentified lifeform is loose on the ship, and an automatic distress signal has already been sent.

The player cannot directly control the character or move through the ship. Instead, every decision is made through the terminal.

The game is built around **information, prediction and resource management**:

- Scan the lifeform with RADAR.
- Track possible movement using the ship map.
- Temporarily lock connections between rooms.
- Use SOUND devices to redirect the lifeform.
- Monitor ventilation access and the hidden vent network.
- Use STEAM to attempt to force a hidden lifeform out of the vents.
- Manage turns carefully until rescue can arrive.

## Core Gameplay

### Turn-based simulation

The game uses a discrete turn system.

- The session starts at turn 1.
- The objective is to survive until turn 30.
- Most valid operational commands consume one turn.
- Invalid commands do not consume a turn.
- `HELP` does not consume a turn.
- `MAP` does not consume a turn.
- After normal valid commands, the lifeform receives a movement opportunity.
- Reaching the survival limit triggers mission completion.

The player therefore has to consider not only **what** command to execute, but also **when** to execute it.

### Ship map

The ship is represented as a connected room graph.

Current rooms:

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

Connections are defined in `src/game/rooms.js`. The map component builds the visual connection network from the same room data used by the game engine, keeping the visual topology synchronized with the simulation.

The map can display:

- Player location
- Last known RADAR contact
- Active door locks
- Lock battery indicators
- Sound devices
- Ventilation access points

The map is an informational interface and does not advance the game turn.

## Lifeform AI / Movement

The lifeform is simulated entirely on the client through the custom game engine.

### Normal movement

During normal movement, the lifeform:

- Can move through connected rooms.
- Moves at most one room per movement opportunity.
- May remain in its current room.
- Respects active door locks.
- Can enter the ventilation system depending on the current room and its exits.

The player does **not** receive continuous tracking. RADAR represents the most recent known contact, not a guaranteed current position.

### Locked connections

The lifeform does not automatically choose another route when it encounters a locked connection during normal movement.

If it selects a locked connection:

1. The terminal reports motion.
2. The lifeform attempts to break the door.
3. The connection remains blocking the movement.
4. The lifeform stays in its current room for that movement opportunity.

This makes temporary locks useful for manipulating movement without completely controlling the lifeform.

## Door Lock System

Locks are created with:

`LOCK [ROOM] [ROOM]`

Example:

`LOCK CARGO AIRLOCK`

Only directly connected rooms can be locked.

Each lock:

- Starts with 3 battery units.
- Keeps 3 battery units during its creation turn.
- Loses battery on subsequent turns.
- Expires when its battery reaches zero.
- Is tracked independently from other locks.

The engine uses a normalized room-pair key so the same connection is represented consistently regardless of command order.

Example:

`LOCK CARGO AIRLOCK`

and

`LOCK AIRLOCK CARGO`

refer to the same physical connection.

## RADAR

RADAR is a deliberate **last-known-position system**, rather than continuous tracking.

When a scan succeeds:

- The most recent lifeform position is recorded.
- The position is displayed on the map.
- The lifeform can move after the scan.
- The player must use the map topology to reason about possible movement.

If the lifeform enters the ventilation network:

`NO CONTACT DETECTED.`

The lack of a radar contact does not mean the lifeform has disappeared.

## Ventilation System

Between 1 and 3 ventilation access points are generated randomly at the beginning of each session.

All vents belong to a **single shared ventilation network**.

### Vent entry

When the lifeform enters a room containing a vent:

- **40% chance** to enter ventilation if at least one exit is unlocked.
- **80% chance** to enter ventilation if every exit is locked.

This creates an important trade-off: completely blocking a room can make ventilation more attractive to the lifeform.

### Hidden state

While inside ventilation:

- The lifeform has no room position.
- `alienRoom` becomes `null`.
- RADAR cannot detect it.
- Normal room-to-room movement is suspended.

At each hidden movement opportunity:

- **75% chance** to remain in the vents.
- **25% chance** to exit through a randomly selected vent room.

The exit room does not have to be the same room where the lifeform entered.

### Steam

The `STEAM` command attempts to force a hidden lifeform out of ventilation.

- Consumes one turn.
- Has a **30% success chance**.
- On success, the lifeform exits through a randomly selected vent room.
- The terminal confirms that steam was activated, but does not reveal whether it succeeded.
- RADAR can be used afterward to regain information.

## Sound Devices

Each session generates **1 to 5 sound devices** in unique rooms.

Command:

`SOUND [ROOM]`

Example:

`SOUND CARGO`

When a valid device is activated:

1. The command consumes one turn.
2. Normal random movement is skipped for that turn.
3. The lifeform pursues the sound source.
4. A route is calculated toward the target.
5. Locked connections do not provide normal protection during sound pursuit.
6. The lifeform can break through locked connections when necessary.
7. The player is not automatically attacked if the pursuit path passes through their room.
8. When the target is reached, the device is destroyed.

Sound devices therefore act as a limited resource for deliberately redirecting the threat.

The map displays active sound devices, and destroyed devices disappear from the available pool.

## Pathfinding

The game engine includes a custom pathfinding routine used for sound pursuit.

Route selection prioritizes:

1. Fewer locked connections.
2. Shorter distance.

The result includes both the selected path and the locked connections that would need to be crossed.

This separates **normal movement AI** from **directed sound pursuit**, allowing the two states to behave differently.

## Commands

| Command | Purpose | Consumes turn |
|---|---|---:|
| `HELP` | Displays available commands | No |
| `STATUS` | Shows turn, location, sound devices and active locks | Yes |
| `LOOK` | Inspects the current room and exits | Yes |
| `RADAR` | Scans for the lifeform's last known position | Yes |
| `MAP` | Opens the ship schematic | No |
| `LOCK [ROOM] [ROOM]` | Locks an adjacent connection | Yes |
| `SOUND [ROOM]` | Activates a sound device | Yes |
| `STEAM` | Attempts to force a hidden lifeform from ventilation | Yes |

## Game States

The engine keeps the session state in a single game object containing:

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

The lifeform currently has two explicit movement states:

- `normal`
- `inVent`

This state-based approach keeps the simulation logic separate from the presentation layer.

## Application Architecture

The project follows a small component-based React structure:

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

### Component responsibilities

**App.jsx**

Controls the main application flow:

- Menu
- Loading screen
- Game screen
- Terminal/map view switching
- Tutorial modal
- Game-over sequence
- Session restart

**Terminal.jsx**

Provides the command-line interface:

- Command input
- Command submission
- Terminal log rendering
- Custom text cursor
- Automatic output scrolling
- MAP access

**Map.jsx**

Renders the ship schematic using React and SVG:

- Room nodes
- Physical connections
- Player marker
- RADAR marker
- Lock indicators
- Battery indicators
- Sound devices
- Vent markers

**StatusBar.jsx**

Displays:

- Current location
- Current turn
- Game status

**Menu.jsx**

Provides:

- New Game
- Tutorial

**LoadingScreen.jsx**

Simulates shipboard system initialization with a progress sequence before starting a session.

**TutorialModal.jsx**

Contains the in-game operations manual explaining the game's mechanics and command system.

**gameEngine.js**

Contains the core simulation logic:

- Game initialization
- Random placement
- Lifeform movement
- Pathfinding
- Door locks
- RADAR
- Sound pursuit
- Ventilation
- Steam
- Turn progression
- Victory and game-over conditions
- Terminal command parsing

**rooms.js**

Defines the ship topology and available room connections.

## Randomization

Every new session generates a different initial state.

Randomized elements include:

- Player starting room
- Lifeform starting room
- Sound device locations
- Ventilation locations

The engine also uses random decisions during the simulation for:

- Lifeform movement
- Vent entry
- Vent persistence
- Vent exits
- Steam success
- Atmospheric/system events

This prevents a fixed optimal sequence from being reused between sessions.

## Interface Design

The visual interface intentionally combines:

- CRT-inspired presentation
- Monospaced typography
- Green monochrome terminal palette
- Scanlines and screen effects
- Industrial computer-console styling
- Minimal HUD elements
- Schematic ship visualization

The UI is designed to feel like a functional shipboard computer rather than a conventional game menu.

The game also includes responsive layouts for smaller screens.

## Project Goals

This project was built as a practical exercise in:

- React component architecture
- State-driven UI
- JavaScript game logic
- Graph-based movement systems
- Pathfinding
- Randomized simulations
- Command parsing
- Conditional rendering
- SVG-based interfaces
- Responsive CSS
- UI/UX design
- Separating game logic from presentation

## Running Locally

### Requirements

- Node.js
- npm

### Installation

```bash
git clone https://github.com/Richter06/AlienTerminal.git
cd AlienTerminal/alien-terminal
npm install
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Dependencies

### Runtime

- React
- React DOM

### Development

- Vite
- @vitejs/plugin-react
- ESLint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

No game backend or external database is required.

## Deployment

The project is configured as a client-side React application and is deployed through Cloudflare Workers.

The Vite production build generates the static application that is served to the browser.

## Current Scope

The current version focuses on the terminal survival loop:

**Observe → Decide → Execute command → Advance turn → React to the lifeform → Survive**

The architecture is intentionally separated so new systems can be added to the simulation without having to rebuild the terminal or map interface.

## Author

**Richard R. Araújo**

- GitHub: https://github.com/Richter06
- Repository: https://github.com/Richter06/AlienTerminal

---

*Built as an independent front-end/game development project.*
