import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import Login from "./components/Login";
import Game from "./components/Game";
import Result from "./components/Result";
import "./App.css";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<GameWrapper />} />
          <Route path="/result" element={<ResultWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

function GameWrapper() {
  return <div className="gradient-bg"><Game /></div>;
}

function ResultWrapper() {
  return <div className="gradient-bg"><Result /></div>;
}