export default function Menu({ onNewGame, onTutorial }) {
  return (
    <section className="menu-screen">
      <div className="menu-content">
        <div className="menu-header">
          USCSS SYSTEMS — SHIPBOARD TERMINAL
        </div>

        <div className="menu-title">
          ALIEN TERMINAL
        </div>

        <div className="menu-subtitle">
          SHIPBOARD COMPUTER INTERFACE
        </div>

        <div className="menu-options">
          <button
            type="button"
            onClick={onNewGame}
          >
            &gt; NEW GAME
          </button>

          <button
            type="button"
            onClick={onTutorial}
          >
            &gt; TUTORIAL
          </button>
        </div>

        <div className="menu-footer">
          SYSTEM READY
        </div>
      </div>
    </section>
  );
}