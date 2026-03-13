// import React, { useEffect, useState } from "react";

const Result = ({ score, total, onPlayAgain, highScore, isNewHighScore }) => {
    const token = localStorage.getItem("token");

    return (
        <div className="result-screen">
            <div className="title-wrapper">
                <h1 className="beatles-title">Which Beatle Said It?</h1>
            </div>

            <div className="record">
                <div className="record-label">
                    Which Beatle<br />Said It?
                </div>
            </div>

            <h2 style={{ color: "#4d3e02", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>Game Over!</h2>

            <p style={{ color: "#4d3e02", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
                You scored {score} out of {total}
            </p>

            {token && (
                <>
                    <p className="high-score-result">
                        High Score: <strong>{highScore}</strong>
                    </p>

                    {isNewHighScore && score !== 0 && (
                        <p className="new-high-score">
                            🎉 New High Score 🎶
                        </p>
                    )}
                </>
            )}

            <button className="play-again-button" onClick={onPlayAgain}>
                Play Again!
            </button>
            <button
                className="logout-button"
                onClick={() => {
                    localStorage.removeItem("username");
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}
            >
                Logout / "Get Back" to Home Screen
            </button>

            <p className="end-quote">
                <i>"And in <strong>the end</strong>, the love you take is equal to the love you make."</i>
                <br />
                - Paul McCartney (from 'The End', 1969)
            </p>
        </div>
    );
};

export default Result;