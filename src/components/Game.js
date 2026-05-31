import React, { useState, useEffect, useRef, useCallback } from "react";
import quotesBank from "../data/quotesBank";
import Result from "./Result";

const Game = () => {
  const [quotations, setQuotations] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);
  const TIMER_DURATION = 20;
  const [timedOut, setTimedOut] = useState(false);
  const [waiting, setWaiting] = useState(false);


  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleTimeout = useCallback(() => {
    setTimedOut(true);
  }, []);

  const handleNext = () => {
    setTimedOut(false);
    const next = currentQuote + 1;
    if (next >= quotations.length) setShowResult(true);
    else setCurrentQuote(next);
  };

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimeout]);

  // Load quotes
  useEffect(() => {
    const shuffled = shuffleArray(quotesBank);
    setQuotations(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    if (quotations.length > 0 && !showResult) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [currentQuote, quotations.length, showResult, startTimer]);

  // Fetch user's high score from backend
  useEffect(() => {
    const fetchHighScore = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://which-beatle-api.onrender.com/highscore", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHighScore(data.highScore || 0);
      } catch (err) {
        console.error("Error fetching high score:", err);
      }
    };
    fetchHighScore();
  }, [token]);

  // Save score when game ends
  useEffect(() => {
    const saveScore = async () => {
      if (!showResult || !token) return;

      try {
        const res = await fetch("https://which-beatle-api.onrender.com/score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score }),
        });

        const data = await res.json();

        if (res.ok) {
          setIsNewHighScore(data.isNewHighScore);
          setHighScore(data.highScore);
        }
      } catch (err) {
        console.error("Error saving score:", err);
      }
    };

    saveScore();
  }, [showResult, score, token]);

  const handleAnswer = (answer) => {
    clearInterval(timerRef.current);
    setTimedOut(false);
    setWaiting(true);
    const isCorrect = answer === quotations[currentQuote].answer;
    const nextScore = isCorrect ? score + 1 : score;
    const nextQuote = currentQuote + 1;

    setScore(nextScore);

    setTimeout(() => {
      setWaiting(false);
      if (nextQuote < quotations.length) setCurrentQuote(nextQuote);
      else setShowResult(true);
    }, 2500);
  };

  const playAgain = () => {
    clearInterval(timerRef.current);
    setTimedOut(false);
    const shuffled = shuffleArray(quotesBank);
    setQuotations(shuffled.slice(0, 10));
    setScore(0);
    setCurrentQuote(0);
    setShowResult(false);
  };

  if (showResult) {
    return <Result score={score} total={quotations.length} onPlayAgain={playAgain} highScore={highScore} isNewHighScore={isNewHighScore} />;
  }

  if (quotations.length === 0) return <div>Loading...</div>;

  const q = quotations[currentQuote];

  return (
    <div className="game">
      {username !== "Guest" ? (
        <p className="welcome-user">
          Welcome, <strong>{username}</strong> 🎶
        </p>
      ) : (
        <p className="guest-welcome">
          Playing as <strong>Guest</strong>
        </p>
      )}

      <div className="title-wrapper">
        <h1 className="beatles-title">Which Beatle Said It?</h1>
      </div>

      <h2 className="quote">{q.quote}</h2>

      <div className="timer-bar-wrap">
        <div
          className="timer-bar"
          style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
        />
        <p className="timer-label">{timeLeft}sec</p>
      </div>

      {timedOut ? (
        <div className="timeout-message">
          <p>⏰ Time's up!</p>
          <button onClick={handleNext}>
            {currentQuote + 1 >= quotations.length ? "See Results" : "Next Quote →"}
          </button>
        </div>
      ) : (
        <div className="options">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={waiting}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <h4 className="progress">
        Quote: {currentQuote + 1} of {quotations.length}
      </h4>

      {username !== "Guest" && (
        <p className="high-score">
          High Score: <strong>{highScore}</strong>
        </p>
      )}

      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout/Go to Home Screen
      </button>
    </div>
  );
};

export default Game;