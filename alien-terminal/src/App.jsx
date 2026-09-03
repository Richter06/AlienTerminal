import { useEffect, useState } from "react";

import Map from "./components/Map";
import Terminal from "./components/Terminal";
import StatusBar from "./components/StatusBar";

import { createGame, executeCommand } from "./game/gameEngine";

import "./App.css";

export default function App() {
  const [game, setGame] = useState(() => createGame());
  const [view, setView] = useState("terminal");
  const [gameOverSequence, setGameOverSequence] = useState(false);
  const [gameOverDots, setGameOverDots] = useState([]);


  useEffect(() => {
    if (!game.gameOver) {
      return;
    }

    setGameOverSequence(true);
    setGameOverDots([]);

    const timers = [
      setTimeout(() => {
        setGameOverDots(["..."]);
      }, 1000),

      setTimeout(() => {
        setGameOverDots(["...", "..."]);
      }, 2000),

      setTimeout(() => {
        setGameOverDots(["...", "...", "..."]);
      }, 3000),

      setTimeout(() => {
        setGameOverSequence(false);
      }, 3500),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [game.gameOver]);



  function handleCommand(command) {
    if (command.trim().toUpperCase() === "MAP") {
      setView("map");
      return;
    }

    setGame((currentGame) => executeCommand(currentGame, command));
  }

  function restartGame() {
    setGame(createGame());
    setGameOverDots([]);
    setGameOverSequence(false);
    setView("terminal");
  }

  return (
    <main className="app">
      <div className="game-window">
        <div className="game-header">
          <div>
            <span className="system-light" />
            ALIEN TERMINAL
          </div>

          <span>USCSS SYSTEMS</span>
        </div>

        <StatusBar game={game} />

        <div className="game-content">
          {view === "terminal" ? (
            <Terminal
              game={game}
              onCommand={handleCommand}
              gameOverDots={gameOverDots}
            />
          ) : (
            <Map
              game={game}
              onExit={() => setView("terminal")}
            />
          )}
        </div>

        {(!gameOverSequence && (game.gameOver || game.victory)) && (
          <div className="game-result">
            <h2>
              {game.gameOver ? "GAME OVER" : "MISSION COMPLETE"}
            </h2>

            <button onClick={restartGame}>
              NEW SESSION
            </button>
          </div>
        )}
      </div>
    </main>
  );
}