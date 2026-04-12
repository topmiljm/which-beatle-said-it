import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrors({ form: "Username and password required" });
      return;
    }

    try {
      const res = await fetch("https://which-beatle-api.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || "Login failed" });
        return;
      }

      // Save username & token
      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token);

      navigate("/game");
    } catch (err) {
      console.error(err);
      setErrors({ form: "Server error" });
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setErrors({ form: "Username and password required" });
      return;
    }

    try {
      const res = await fetch("https://which-beatle-api.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || "Registration failed" });
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token);

      navigate("/game");
    } catch (err) {
      console.error(err);
      setErrors({ form: "Server error" });
    }
  };

  // const handleGuest = () => {
  //   localStorage.removeItem("token");
  //   localStorage.setItem("username", "Guest");
  //   navigate("/game");
  // };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>

        {errors.form && <p className="form-error">{errors.form}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            maxLength="20"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
          />

          <input
            type="password"
            maxLength="30"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          <button type="submit" className="play-button auth-button">
            Login & Play
          </button>
        </form>

        <button className="play-button auth-button" onClick={handleRegister}>
          Register & Play
        </button>

        {/* <button className="logout-button" onClick={handleGuest}>
          Play as Guest
        </button> */}
        <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        "Get Back" to Home Screen
      </button>
      </div>
    </div>
  );
}

export default Login;