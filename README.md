# Which Beatle Said It? 🎸

A full-stack trivia game where players guess which member of The Beatles said iconic quotes.

Built with **React**, **Node.js**, **Express**, and **SQLite**.

---

## 🌐 Deployment Note

⚠️ The backend is hosted on Render (free tier). The first request may take a few seconds due to cold starts.

---

## Features

* 🎵 Beatles quote trivia game
* 👤 User registration and login (JWT authentication)
* 🏆 Personal high score tracking
* 🎲 Randomized quotes every game
* 👥 Guest mode available
* 💾 Scores saved to SQLite database
* 🔐 Secure password hashing with bcrypt

---

## Screenshots

![Game Screenshot 1](screenshots/game-screenshot-2.png)
![Game Screenshot 2](screenshots/game-screenshot-1.png)

---

## Tech Stack

Frontend

* React
* JavaScript
* CSS

Backend

* Node.js
* Express
* SQLite

Authentication

* JSON Web Tokens (JWT)
* bcrypt

---

## 🌐 Deployment

- Frontend: Vercel  
  https://which-beatle-said-it.vercel.app/

- Backend API: Render (free tier hosting)

---

## How It Works

1. A user registers or logs in.
2. The game loads 10 random Beatles quotes.
3. The player guesses which Beatle said each quote.
4. The score is calculated.
5. If the score beats the user's previous best, a **new high score** is saved.

Guest users can play the game but their scores are not stored.

---

## Installation

Clone the repository:

git clone https://github.com/topmiljm/which-beatle-said-it.git

Install dependencies:
npm install

cd backend
npm install

---

## Running the App

Start the backend server:

cd backend
node server.js

Start the React app:

cd frontend
npm start

The frontend will run on:

http://localhost:3000

The backend runs on:

http://localhost:5000

---

## 🌐 Deployment Notes

The backend API is hosted on Render using the free tier.

Because of this, the server may spin down during periods of inactivity. When this happens, the first request can take a few seconds to respond while the server restarts (cold start behavior).

After the initial request, performance returns to normal.

---

## Future Improvements

* Global leaderboard
* Difficulty levels
* Timer mode
* More quote categories
* Deployment (Render / Vercel)

---

## Author

James T
Aspiring Software Developer
