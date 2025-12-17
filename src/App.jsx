import { useState, useEffect } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' })
  const [message, setMessage] = useState('')

  // 1. READ (Get all books)
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/books')
      const data = await res.json()
      if (data.data) {
        setBooks(data.data)
      }
    } catch (err) {
      console.error(err)
      setMessage('Error fetching books')
    }
  }

  // 2. CREATE (Add a book)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      if (res.ok) {
        setMessage('Book added!')
        setNewBook({ title: '', author: '', year: '', genre: '' })
        fetchBooks() // Refresh list
      } else {
        setMessage('Error adding book')
      }
    } catch (err) {
      setMessage('Error adding book')
    }
  }

  // 3. DELETE (Remove a book)
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setMessage('Book deleted!')
        fetchBooks() // Refresh list
      }
    } catch (err) {
      setMessage('Error deleting book')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📚 ZAYN Books</h1>
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {/* CREATE FORM */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Add New Book</h3>
        <form onSubmit={handleSubmit}>
          <input 
            placeholder="Title" 
            value={newBook.title} 
            onChange={e => setNewBook({...newBook, title: e.target.value})} 
            required 
          />
          <input 
            placeholder="Author" 
            value={newBook.author} 
            onChange={e => setNewBook({...newBook, author: e.target.value})} 
            required 
          />
          <input 
            placeholder="Year" 
            type="number"
            value={newBook.year} 
            onChange={e => setNewBook({...newBook, year: e.target.value})} 
          />
          <input 
            placeholder="Genre" 
            value={newBook.genre} 
            onChange={e => setNewBook({...newBook, genre: e.target.value})} 
          />
          <button type="submit">Add Book</button>
        </form>
      </div>

      {/* READ LIST */}
      <h3>Library Inventory ({books.length})</h3>
      <ul>
        {books.map(book => (
          <li key={book.id} style={{ marginBottom: '10px' }}>
            <strong>{book.title}</strong> by {book.author} ({book.year})
            <button 
              onClick={() => handleDelete(book.id)} 
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
