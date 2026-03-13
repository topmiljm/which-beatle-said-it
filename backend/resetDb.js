const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  // Drop old scores table if it exists
  db.run(`DROP TABLE IF EXISTS scores`, (err) => {
    if (err) console.error("Error dropping scores table:", err);
    else console.log("Dropped old scores table (if existed).");
  });

  // Recreate scores table with correct column
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error("Error creating scores table:", err);
    else console.log("Created scores table with correct 'score' column.");
  });

  // Optional: you can also reset users table if needed
  // db.run(`DROP TABLE IF EXISTS users`);
});

db.close();