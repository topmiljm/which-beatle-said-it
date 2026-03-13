const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// List all tables
db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
  if (err) return console.error("Error fetching tables:", err);
  console.log("Tables in database:", tables.map(t => t.name));

  // For each table, show its columns and rows
  tables.forEach(t => {
    console.log(`\n--- Table: ${t.name} ---`);

    db.all(`PRAGMA table_info(${t.name})`, (err, columns) => {
      if (err) return console.error("Error fetching columns:", err);
      console.log("Columns:", columns.map(c => `${c.name} (${c.type})`));

      db.all(`SELECT * FROM ${t.name}`, (err, rows) => {
        if (err) return console.error("Error fetching rows:", err);
        console.log("Rows:", rows);
      });
    });
  });
});