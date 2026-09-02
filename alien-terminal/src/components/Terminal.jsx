
import { useEffect, useRef, useState } from "react";

export default function Terminal({ game, onCommand }) {
  const [input, setInput] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const cursorRef = useRef(null);
  

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [game.logs]);

  useEffect(() => {
    updateCursorPosition();
  }, [input, cursorPosition]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    onCommand(input);
    setInput("");
    setCursorPosition(0);
  }

  function handleChange(event) {
    const value = event.target.value.toUpperCase();

    setInput(value);
    setCursorPosition(event.target.selectionStart);
  }

  function handleSelect(event) {
    setCursorPosition(event.target.selectionStart);
  }

 function updateCursorPosition() {
  if (!inputRef.current || !cursorRef.current) {
    return;
  }

  const styles = getComputedStyle(inputRef.current);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = styles.font;

  const textBeforeCursor = input.slice(0, cursorPosition);

  let width = context.measureText(textBeforeCursor).width;

  const letterSpacing = parseFloat(styles.letterSpacing) || 0;

  if (textBeforeCursor.length > 0) {
    width += letterSpacing * textBeforeCursor.length;
  }

  cursorRef.current.style.left = `${width}px`;
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

          <div className="terminal-input-wrapper">
           
            

            <input
              ref={inputRef}
              value={input}
              onChange={handleChange}
              onSelect={handleSelect}
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />

            <span
              ref={cursorRef}
              className="terminal-caret"
              aria-hidden="true"
            />
          </div>
        </form>
      )}
    </section>
  );
}

