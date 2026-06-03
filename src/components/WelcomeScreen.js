import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../App.css'; // make sure your CSS is imported


function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://which-beatle-api.onrender.com/health").catch(() => { });
  }, []);

  const handlePlayAsGuest = () => {
    localStorage.removeItem("token");       // no JWT for guests
    localStorage.setItem("username", "Guest");
    navigate("/game");
  };

  return (
    <div className="welcome-screen">
      < div className="welcome-card">
        {/* Title */}
        <div className="title-wrapper-welcome">
          <h1 className="beatles-title-welcome">Which</h1>
          <h1 className="beatles-title-welcome">Beatle</h1>
          <h1 className="beatles-title-welcome">Said It?</h1>
        </div>

        {/* Welcome instructions */}
        <p className="welcome-text">
          Can you guess which member of the Fab Four said it?
          You will be shown 10 quotes or lyrics and you will have 30 seconds to guess
          which Beatle said the given quote or sang the given lyric. Test your Beatles knowledge and play now.
        </p>

        {/* Optional login link */}
        <div>
          <Link
            to="/login" className="login-link">
            <strong>Login</strong>
            <span className="login-link-2"> (to save your score)</span>
          </Link>

        </div>

        {/* Play button (navigates to game) */}
        <button
          className="play-button"
          onClick={handlePlayAsGuest}
        >
          Play the Game
        </button>

        {/* End quote */}
        <p className="end-quote">
          <i>"There's nothing you can say but you can learn how to <strong>play the game. It's easy</strong>."</i>
          <br />
          - John Lennon (from 'All You Need Is Love', 1967)
        </p>

      </div>
    </div>
  );
}

export default WelcomeScreen;