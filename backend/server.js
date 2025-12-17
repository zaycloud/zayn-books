const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow Frontend to talk to us
app.use(express.json()); // Parse JSON bodies (e.g. new book data)

// --- ROUTES ---

// 1. GET ALL BOOKS
app.get('/api/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


app.post('/api/books', (req, res) => {
  const { title, author, year, genre } = req.body;
  
  
  if (!title || !author) {
    res.status(400).json({ error: 'Title and Author are required' });
    return;
  }

  const sql = 'INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)';
  const params = [title, author, year, genre];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: 'success',
      data: { id: this.lastID, title, author, year, genre }
    });
  });
});

// 3. UPDATE A BOOK
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;

  // VG Requirement: Input Validation
  if (!title || !author) {
    res.status(400).json({ error: 'Title and Author are required' });
    return;
  }

  const sql = `UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?`;
  const params = [title, author, year, genre, id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json({
      message: 'success',
      data: { id, title, author, year, genre }
    });
  });
});

// 4. DELETE A BOOK
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM books WHERE id = ?';
  
  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json({ message: 'deleted', changes: this.changes });
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export for testing
