const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db"); // your SQLite database connection

const app = express();
app.use(cors());
app.use(express.json());


require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

// ==========================
// Middleware for JWT auth
// ==========================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalid or expired" });
  }
};

// ==========================
// Routes
// ==========================

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) return res.status(400).json({ error: "User already exists" });

        const token = jwt.sign({ id: this.lastID }, SECRET);
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login existing user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(400).json({ error: "Invalid login" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid login" });

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
  });
});

// Save high score
app.post("/score", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { score } = req.body;

  if (typeof score !== "number") {
    console.error("Score is not a number:", score);
    return res.status(400).json({ error: "Score must be a number" });
  }

  db.get(
    "SELECT MAX(score) AS highScore FROM scores WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) {
        console.error("SQLite error fetching high score:", err);
        return res.status(500).json({ error: err.message });
      }

      const previousHigh = row ? row.highScore || 0 : 0;
      const isNewHighScore = score > previousHigh;

      db.run(
        "INSERT INTO scores (user_id, score) VALUES (?, ?)",
        [userId, score],
        function (err) {
          if (err) {
            console.error("SQLite error inserting score:", err);
            return res.status(500).json({ error: err.message });
          }

          console.log(
            `User ${userId} submitted score ${score}, previous high ${previousHigh}`
          );

          res.json({
            success: true,
            isNewHighScore,
            highScore: isNewHighScore ? score : previousHigh,
          });
        }
      );
    }
  );
});


app.get("/", (req, res) => {
  res.send("Which Beatle API is running 🎶");
});

// Fetch current user high score
app.get("/highscore", authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.get(
    "SELECT MAX(score) AS highScore FROM scores WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) {
        console.error("SQLite error fetching highscore:", err);
        return res.status(500).json({ error: err.message });
      }

      console.log(`User ${userId} highscore:`, row.highScore || 0);

      res.json({ highScore: row.highScore || 0 });
    }
  );
});

// ==========================
// Start server
// ==========================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));