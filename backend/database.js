const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use in-memory database for tests, file-based for production
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : path.resolve(__dirname, 'books.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.' + (isTest ? ' (test mode)' : ''));
  }
});

// Create the 'books' table if it doesn't exist
// This ensures we always have a place to store data.
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    genre TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Books table ready.');
    }
  });
});

module.exports = db;
