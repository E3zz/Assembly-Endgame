import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { languages } from "./languages";
import { words } from "./words";
import Confetti from "react-confetti";
import { getFarewellText } from "./utils";

function App() {
  const [lang, setlang] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [keystroke, setKeystoke] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setgameWon] = useState(false);
  const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  window.addEventListener("resize", handleResize);

  // Cleanup on unmount
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const newGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(randomWord);
    setKeystoke([]);
    setIsGameOver(false);
    setWrongGuesses(0);
    setgameWon(false);
  };
  const handlePress = useCallback((event) => {
    const key = event.key.toLowerCase();

    // Only allow a-z
    if (!/^[a-z]$/.test(key)) return;

    setKeystoke((prevKeys) =>
      prevKeys.includes(key) ? prevKeys : [...prevKeys, key]
    );
  }, []);

  useEffect(() => {
    const isWon = selectedWord
      .split("")
      .every((char) => keystroke.includes(char));
    if (isWon) {
      setgameWon(true);
    } else {
      setgameWon(false);
    }
  }, [keystroke, selectedWord]);

  useEffect(() => {
    const currentWrongGuesses = keystroke.filter(
      (k) => !selectedWord.includes(k)
    ).length;

    setWrongGuesses(currentWrongGuesses); // ✅ Update state

    const validMoves = 8;

    if (currentWrongGuesses >= validMoves) {
      setIsGameOver(true);
    } else {
      setIsGameOver(false);
      window.addEventListener("keydown", handlePress);
    }

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [keystroke, handlePress, selectedWord]);

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(randomWord);
    setSelectedWord(randomWord);
  }, []);

  useEffect(() => {
    setlang(languages);
  }, []);

const displayText = () => {
  if (wrongGuesses === 0) return "";
  const lastIndex = wrongGuesses - 1;
  return getFarewellText(lang[lastIndex]?.name);
};
  const keys = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // A to Z
  const row1 = keys.slice(0, 10); // A - J
  const row2 = keys.slice(10, 20); // K - S
  const row3 = keys.slice(20);

  return (
    <>
      <main className="main-container">
        <header>
          <div className="container">
            <span className="sp1">Assembly: Endgame</span>
            <span className="sp2">
              Guess the word in under 8 attempts to keep the programming world
              safe from Assembly!
            </span>
          </div>
          
          {wrongGuesses > 0 && !isGameOver ? (
            <div className="text-box">
              <div className="txt">
                <p>{displayText()}</p>
              </div>
            </div>
          ) : isGameOver ? (
            <div className="text-box">
              <div className="gameOver">
                <span>You lose! Better start learning Assembly 😭</span>
              </div>
            </div>
          ) : null}
        </header>

        <section>
          <div className="parent">
            {lang.map((tech, idx) => {
              const isDull = idx < wrongGuesses;
              return (
                <div
                  key={idx}
                  className={isDull ? "dull" : "language"}
                  style={{
                    background: isDull ? "#ccc" : tech.backgroundColor,
                    color: isDull ? "#666" : tech.color,
                  }}
                >
                  {tech.name}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="container-input">
            <div className="keys">
              {selectedWord.split("").map((char, idx) => (
                <div key={idx} className="key">
                  {keystroke.includes(char) ? char : null}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="Keyboard-container">
            <div className="allkeys row">
              {row1.map((key, idx) => (
                <div
                  key={idx}
                  className={`boardkeys ${
                    keystroke.includes(key.toLowerCase())
                      ? selectedWord.includes(key.toLowerCase())
                        ? "matched"
                        : "unmatched"
                      : ""
                  }`}
                >
                  {key}
                </div>
              ))}
            </div>
            <div className="allkeys row">
              {row2.map((key, idx) => (
                <div
                  key={idx}
                  className={`boardkeys ${
                    keystroke.includes(key.toLowerCase())
                      ? selectedWord.includes(key.toLowerCase())
                        ? "matched"
                        : "unmatched"
                      : ""
                  }`}
                >
                  {key}
                </div>
              ))}
            </div>
            <div className="allkeys row center-last-row">
              {row3.map((key, idx) => (
                <div
                  key={idx}
                  className={`boardkeys ${
                    keystroke.includes(key.toLowerCase())
                      ? selectedWord.includes(key.toLowerCase())
                        ? "matched"
                        : "unmatched"
                      : ""
                  }`}
                >
                  {key}
                </div>
              ))}
            </div>
          </div>
        </section>
        {isGameOver ? (
          <div className="btn">
            <button onClick={newGame}>New Game</button>
          </div>
        ) : gameWon ? (
          <>
            <Confetti windowSize={windowSize} />
            <div className="btn">
              <button onClick={newGame}>New Game</button>
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}

export default App;
