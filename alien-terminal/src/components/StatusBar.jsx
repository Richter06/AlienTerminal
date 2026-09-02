export default function StatusBar({ game }) {
  return (
    <header className="status-bar">
      <div>
        <span className="label">LOCATION</span>
        <span>{game.playerRoom.toUpperCase()}</span>
      </div>

      <div>
        <span className="label">TURN</span>
        <span>
          {game.turn}/{game.maxTurns}
        </span>
      </div>

      <div>
        <span className="label">STATUS</span>
        <span>
          {game.gameOver
            ? "DEAD"
            : game.victory
              ? "SURVIVED"
              : "ACTIVE"}
        </span>
      </div>
    </header>
  );
}