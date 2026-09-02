import { useEffect, useRef, useState } from "react";

export default function Terminal({ game, onCommand }) {
  const [input, setInput] = useState("");
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [game.logs]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    onCommand(input);
    setInput("");
  }

  return (
    <section className="terminal-panel">
      <div className="panel-title">TERMINAL</div>

      <div className="terminal-output">
        {game.logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}

        <div ref={terminalEndRef} />
      </div>

      {!game.gameOver && !game.victory && (
        <form className="terminal-input" onSubmit={handleSubmit}>
          <span>&gt;</span>

          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      )}
    </section>
  );
}