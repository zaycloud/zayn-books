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

  // 3. DELETE (Remove a book) - with confirmation
  const handleDelete = async (id) => {
    // UX: Confirmation before delete
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
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
    <div style={{ 
      padding: '20px', 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>📚 ZAYN Books</h1>
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {/* CREATE FORM - Responsive */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}>
        <h3>Add New Book</h3>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <input 
            placeholder="Title" 
            value={newBook.title} 
            onChange={e => setNewBook({...newBook, title: e.target.value})} 
            required 
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <input 
            placeholder="Author" 
            value={newBook.author} 
            onChange={e => setNewBook({...newBook, author: e.target.value})} 
            required 
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <input 
            placeholder="Year" 
            type="number"
            value={newBook.year} 
            onChange={e => setNewBook({...newBook, year: e.target.value})} 
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <input 
            placeholder="Genre" 
            value={newBook.genre} 
            onChange={e => setNewBook({...newBook, genre: e.target.value})} 
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <button type="submit" style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Add Book</button>
        </form>
      </div>

      {/* READ LIST - Responsive */}
      <h3>Library Inventory ({books.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {books.map(book => (
          <li key={book.id} style={{ 
            marginBottom: '10px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div>
              <strong>{book.title}</strong> by {book.author} ({book.year})
            </div>
            <button 
              onClick={() => handleDelete(book.id)} 
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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
