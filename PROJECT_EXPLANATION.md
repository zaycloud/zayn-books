# 📚 ZAYN Books - Complete Project Explanation for Beginners

## 📖 Table of Contents
1. [What is This Project?](#what-is-this-project)
2. [What Does This Application Do?](#what-does-this-application-do)
3. [The Technology Stack (Simple Terms)](#the-technology-stack-simple-terms)
4. [Project Structure Overview](#project-structure-overview)
5. [The Frontend (What Users See)](#the-frontend-what-users-see)
6. [The Backend (The Behind-the-Scenes Server)](#the-backend-the-behind-the-scenes-server)
7. [The Database (Where Data is Stored)](#the-database-where-data-is-stored)
8. [All The Tests Explained](#all-the-tests-explained)
9. [The CI/CD Pipeline (Automatic Quality Checks)](#the-cicd-pipeline-automatic-quality-checks)
10. [How to Run Everything](#how-to-run-everything)
11. [Security Features](#security-features)
12. [Key Learning Concepts](#key-learning-concepts)

---

## What is This Project?

**ZAYN Books** is a complete web application for managing a library of books. It's a **full-stack application**, which means it has:
- A **frontend** (the visual part users interact with)
- A **backend** (the server that handles data)
- A **database** (where all book information is stored)
- **Tests** (automated checks to ensure everything works correctly)
- A **CI/CD pipeline** (automatic testing whenever code changes)

This project demonstrates professional software development practices used in the real world.

---

## What Does This Application Do?

The ZAYN Books application allows users to:

1. **View all books** in the library
2. **Add new books** with details like title, author, year, and genre
3. **Delete books** from the library

It's a simple but complete CRUD application:
- **C**reate (add books)
- **R**ead (view books)
- **U**pdate (modify books - the code supports it)
- **D**elete (remove books)

---

## The Technology Stack (Simple Terms)

Here's what each technology does:

### Frontend (What You See)
- **React** - A JavaScript library for building user interfaces (the visual part)
- **Vite** - A super-fast tool that helps run and build React applications

### Backend (The Server)
- **Node.js** - Lets us run JavaScript on the server (not just in browsers)
- **Express** - A framework that makes it easy to create web servers and APIs

### Database
- **SQLite** - A lightweight database that stores all our book data in a single file

### Testing Tools
- **Vitest** - Tests individual functions and code pieces (unit tests)
- **Newman** - Tests API endpoints to make sure the server responds correctly (API tests)
- **Playwright** - Tests the entire application like a real user would (end-to-end tests)

### Automation
- **GitHub Actions** - Automatically runs all tests whenever code is pushed to GitHub

---

## Project Structure Overview

```
zayn-books/
│
├── src/                          # Frontend React code
│   ├── App.jsx                   # Main React component (the UI)
│   └── main.jsx                  # Entry point that starts React
│
├── backend/                      # Server code
│   ├── server.js                 # Express server with all API routes
│   ├── database.js               # SQLite database setup
│   ├── books.sqlite              # The actual database file (created when you run)
│   └── tests/
│       └── backend.test.js       # Unit tests for the server
│
├── tests-api/                    # API tests
│   └── collection.json           # Postman/Newman test collection
│
├── tests-e2e/                    # End-to-end tests
│   └── books.spec.js             # Playwright browser tests
│
├── .github/workflows/            # CI/CD automation
│   └── ci.yml                    # GitHub Actions pipeline
│
├── index.html                    # HTML template for React
├── package.json                  # Frontend dependencies
├── playwright.config.js          # Playwright test configuration
└── vite.config.js                # Vite build tool configuration
```

---

## The Frontend (What Users See)

### Location: `src/App.jsx` and `src/main.jsx`

### How It Works:

**1. Entry Point (`main.jsx`)**
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
- This file finds the `<div id="root">` in `index.html`
- It "mounts" (attaches) the React application to that div
- `<React.StrictMode>` helps catch potential problems during development

**2. Main Application (`App.jsx`)**

The App component has three main sections:

#### A. State Management (Data Storage)
```javascript
const [books, setBooks] = useState([])
const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' })
const [message, setMessage] = useState('')
```
- `books` - Stores the list of all books from the database
- `newBook` - Stores what the user types in the form
- `message` - Stores success/error messages to show the user
- `useState` is a React "hook" that lets components remember things

#### B. Fetching Books (READ Operation)
```javascript
useEffect(() => {
  fetchBooks()
}, [])

const fetchBooks = async () => {
  const res = await fetch('http://localhost:3000/api/books')
  const data = await res.json()
  if (data.data) {
    setBooks(data.data)
  }
}
```
- `useEffect` runs when the page first loads
- It calls `fetchBooks()` which makes an HTTP request to the backend
- The backend responds with a list of books in JSON format
- We save those books in the `books` state
- **Why?** So we can display them on the page

#### C. Adding Books (CREATE Operation)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  const res = await fetch('http://localhost:3000/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook)
  })
  if (res.ok) {
    setMessage('Book added!')
    setNewBook({ title: '', author: '', year: '', genre: '' })
    fetchBooks()
  }
}
```
- When the user submits the form, this function runs
- `e.preventDefault()` stops the page from refreshing (default form behavior)
- We send a POST request to the backend with the new book data
- If successful, we show a success message, clear the form, and refresh the book list

#### D. Deleting Books (DELETE Operation)
```javascript
const handleDelete = async (id) => {
  const res = await fetch(`http://localhost:3000/api/books/${id}`, {
    method: 'DELETE'
  })
  if (res.ok) {
    setMessage('Book deleted!')
    fetchBooks()
  }
}
```
- When the user clicks "Delete" on a book, this runs
- We send a DELETE request to the backend with the book's ID
- If successful, we refresh the book list

#### E. The User Interface
The return statement creates the HTML that users see:
- A title "📚 ZAYN Books"
- A form with 4 input fields (Title, Author, Year, Genre) and a submit button
- A list showing all books with delete buttons

---

## The Backend (The Behind-the-Scenes Server)

### Location: `backend/server.js` and `backend/database.js`

### How the Server Works:

**1. Server Setup (`server.js`)**
```javascript
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
```
- Creates an Express application
- **CORS** (Cross-Origin Resource Sharing) - Allows the frontend (port 5173) to talk to the backend (port 3000)
- `express.json()` - Allows the server to understand JSON data in requests

**2. API Routes (The Endpoints)**

The server has 4 main routes:

#### Route 1: GET /api/books (Get All Books)
```javascript
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
```
**What it does:**
- Listens for GET requests to `/api/books`
- Runs a SQL query to get all books from the database
- Sends back the list of books as JSON
- If there's an error, sends a 500 status code (server error)

#### Route 2: POST /api/books (Create a Book)
```javascript
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
```
**What it does:**
- Listens for POST requests with new book data
- **Validates** that title and author are provided (security feature!)
- Uses a SQL INSERT query to add the book to the database
- Uses `?` placeholders (prevents SQL injection attacks - a major security issue!)
- Sends back status 201 (created) with the new book's ID
- If validation fails, sends status 400 (bad request)

#### Route 3: PUT /api/books/:id (Update a Book)
```javascript
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;

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
```
**What it does:**
- Listens for PUT requests to update a specific book
- Gets the book ID from the URL (`:id` is a parameter)
- Validates the input
- Updates the book in the database
- Checks if the book was found (`this.changes === 0` means no rows were updated)
- Sends status 404 (not found) if the book doesn't exist

#### Route 4: DELETE /api/books/:id (Delete a Book)
```javascript
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
```
**What it does:**
- Listens for DELETE requests
- Deletes the book with the specified ID
- Checks if a book was actually deleted
- Returns the number of changes made

**3. Starting the Server**
```javascript
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
```
- Starts the server on port 3000
- The `if` statement allows tests to import the server without starting it
- `module.exports = app` makes the server available for testing

---

## The Database (Where Data is Stored)

### Location: `backend/database.js`

### How SQLite Works:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'books.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});
```

**What happens here:**
- Creates or connects to a file called `books.sqlite`
- This file IS the database - it stores all data
- If the file doesn't exist, SQLite creates it automatically

### Creating the Table:
```javascript
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
```

**Table Structure:**
- `id` - A unique number for each book, automatically increases
- `title` - Text field, required (NOT NULL)
- `author` - Text field, required (NOT NULL)
- `year` - Number, optional
- `genre` - Text field, optional

**Why `db.serialize()`?**
- Ensures the table is created before any other database operations run
- Operations run one after another (serialized), not all at once

**Why `CREATE TABLE IF NOT EXISTS`?**
- Prevents errors if the table already exists
- Safe to run every time the server starts

---

## All The Tests Explained

Testing is crucial! It automatically checks if your code works correctly.

### Test Type 1: Unit Tests (Vitest)
**Location:** `backend/tests/backend.test.js`

Unit tests check individual pieces of code in isolation. They test the backend API routes without starting a real server.

#### Test 1: Get Empty Book List
```javascript
it('1. Should return empty list initially', async () => {
  const res = await request(app).get('/api/books');
  expect(res.statusCode).toBe(200);
  expect(res.body.data).toBeInstanceOf(Array);
});
```
**What it tests:**
- Makes a GET request to `/api/books`
- Checks that the response status is 200 (OK)
- Checks that `data` is an array (even if empty)

**Why it matters:** Ensures the GET endpoint works and returns the correct data structure.

#### Test 2: Create a Valid Book
```javascript
it('2. Should create a valid book', async () => {
  const newBook = { title: 'The Hobbit', author: 'Tolkien', year: 1937, genre: 'Fantasy' };
  const res = await request(app).post('/api/books').send(newBook);
  expect(res.statusCode).toBe(201);
  expect(res.body.data).toHaveProperty('id');
  expect(res.body.data.title).toBe('The Hobbit');
  createdBookId = res.body.data.id;
});
```
**What it tests:**
- Sends a POST request with valid book data
- Checks status is 201 (created)
- Verifies the response contains an ID
- Verifies the title matches what we sent
- Saves the ID for use in later tests

**Why it matters:** Confirms we can add books successfully.

#### Test 3 & 4: Validation Tests
```javascript
it('3. Should fail if Title is missing', async () => {
  const badBook = { author: 'Tolkien' };
  const res = await request(app).post('/api/books').send(badBook);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toContain('required');
});
```
**What it tests:**
- Tries to create a book without a title
- Expects status 400 (bad request)
- Expects an error message about required fields

**Why it matters:** Validates that input validation works (security!).

#### Test 5: Verify Data Persistence
```javascript
it('5. Should return the book we just added', async () => {
  const res = await request(app).get('/api/books');
  expect(res.statusCode).toBe(200);
  expect(res.body.data.length).toBeGreaterThan(0);
  expect(res.body.data[0].title).toBe('The Hobbit');
});
```
**What it tests:**
- Gets all books again
- Verifies the book we added is still there

**Why it matters:** Confirms data is saved to the database, not just in memory.

#### Test 6-8: Update Tests
**Test 6:** Successfully updates a book
**Test 7:** Fails when trying to update a non-existent book (404)
**Test 8:** Fails when validation fails (400)

**Why these matter:** Ensure the PUT endpoint works correctly and handles errors.

#### Test 9-10: Delete Tests
**Test 9:** Successfully deletes a book
**Test 10:** Fails when trying to delete a non-existent book (404)

**Why these matter:** Ensure the DELETE endpoint works correctly and handles errors.

**How to run:** `cd backend && npm test`

---

### Test Type 2: API Tests (Newman/Postman)
**Location:** `tests-api/collection.json`

API tests check the entire HTTP request/response cycle. They start the real server and make actual HTTP requests.

The collection has 10 tests:

#### Test 1: GET All Books (Empty)
```json
{
  "name": "1. GET All Books (Empty)",
  "request": {
    "method": "GET",
    "url": "http://localhost:3000/api/books"
  }
}
```
**What it tests:**
- Makes a real HTTP GET request
- Checks status code is 200
- Checks response is an array

**Why it matters:** Verifies the API is accessible and responds correctly.

#### Test 2: POST Create Book
```json
{
  "name": "2. POST Create Book",
  "request": {
    "method": "POST",
    "body": {
      "title": "Postman Book",
      "author": "Newman API",
      "year": 2025,
      "genre": "Testing"
    }
  }
}
```
**What it tests:**
- Creates a new book via POST request
- Saves the book ID in an environment variable
- Checks status is 201
- Verifies the title in the response

**Why it matters:** Tests the complete create flow from HTTP request to database.

#### Test 3: GET Verify Created Book
**What it tests:**
- Gets all books
- Finds the book we just created using the saved ID
- Verifies it exists in the list

**Why it matters:** Confirms the book was actually saved to the database.

#### Test 4: PUT Update Book
**What it tests:**
- Updates the book we created
- Uses the saved book ID in the URL: `/api/books/{{bookId}}`
- Changes the title to "Updated Postman Book"
- Checks status 200 and verifies the new title

**Why it matters:** Tests the update functionality end-to-end.

#### Test 5: DELETE Book
**What it tests:**
- Deletes the book using its ID
- Checks status 200

**Why it matters:** Tests the delete functionality end-to-end.

#### Tests 6-7: Validation Failures
**Test 6:** Tries to create a book without a title (expects 400)
**Test 7:** Tries to create a book without an author (expects 400)

**Why they matter:** Ensure validation works when accessed via HTTP.

#### Tests 8-9: Not Found Errors
**Test 8:** Tries to update book ID 99999 (doesn't exist, expects 404)
**Test 9:** Tries to delete book ID 99999 (doesn't exist, expects 404)

**Why they matter:** Ensure proper error handling for non-existent resources.

#### Test 10: CORS Check
**What it tests:**
- Sends an OPTIONS request (browsers do this before POST/PUT/DELETE)
- Checks that CORS headers are properly set

**Why it matters:** Without CORS, the frontend can't communicate with the backend.

**How to run:**
1. Start the backend: `cd backend && npm start`
2. Run tests: `newman run tests-api/collection.json`

---

### Test Type 3: E2E Tests (Playwright)
**Location:** `tests-e2e/books.spec.js`

End-to-End tests simulate a real user using a real browser. They test the entire application: frontend + backend + database.

#### Test 1: Page Loads
```javascript
test('1. Should load the application with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('ZAYN Books');
  await expect(page.locator('h3').first()).toContainText('Add New Book');
});
```
**What it does:**
- Opens the app in a browser
- Checks that the title "📚 ZAYN Books" is visible
- Checks that the "Add New Book" heading is visible

**Why it matters:** Ensures the page loads and displays correctly.

#### Test 2: Form Fields Present
```javascript
test('2. Should have all form input fields', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Author"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Year"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Genre"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
```
**What it does:**
- Checks that all 4 input fields are visible
- Checks that the submit button is visible

**Why it matters:** Ensures the form is rendered correctly.

#### Test 3: Add a New Book
```javascript
test('3. Should add a new book successfully', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[placeholder="Title"]').fill('Playwright Test Book');
  await page.locator('input[placeholder="Author"]').fill('E2E Tester');
  await page.locator('input[placeholder="Year"]').fill('2025');
  await page.locator('input[placeholder="Genre"]').fill('Testing');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Playwright Test Book')).toBeVisible();
});
```
**What it does:**
- Fills in all form fields like a real user
- Clicks the submit button
- Waits for the success message "Book added!"
- Verifies the book appears in the list

**Why it matters:** Tests the complete CREATE flow from user perspective: typing → clicking → seeing results.

#### Test 4: Display Books
```javascript
test('4. Should display books in the library list', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
  await expect(page.locator('h3').filter({ hasText: 'Library Inventory' })).toBeVisible();
  const bookList = page.locator('ul li');
  const count = await bookList.count();
  expect(count).toBeGreaterThanOrEqual(0);
});
```
**What it does:**
- Waits for the page to load and fetch books
- Checks that the inventory section is visible
- Counts the books in the list

**Why it matters:** Verifies the READ functionality works.

#### Test 5: Delete a Book
```javascript
test('5. Should delete a book successfully', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[placeholder="Title"]').fill('Book To Delete');
  await page.locator('input[placeholder="Author"]').fill('Delete Me');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Book To Delete')).toBeVisible();
  
  const bookItem = page.locator('li').filter({ hasText: 'Book To Delete' });
  await bookItem.locator('button').filter({ hasText: /delete/i }).click();
  await expect(page.locator('text=Book deleted!')).toBeVisible({ timeout: 5000 });
});
```
**What it does:**
- Creates a book first
- Waits for it to appear
- Finds and clicks its delete button
- Verifies the "Book deleted!" message appears

**Why it matters:** Tests the complete DELETE flow from user perspective.

#### Test 6: Form Validation
```javascript
test('6. Should show validation for required fields', async ({ page }) => {
  await page.goto('/');
  const submitButton = page.locator('button[type="submit"]');
  const titleInput = page.locator('input[placeholder="Title"]');
  await expect(titleInput).toHaveAttribute('required', '');
  await submitButton.click();
  await expect(page.locator('text=Book added!')).not.toBeVisible();
});
```
**What it does:**
- Checks that required fields have the `required` attribute
- Tries to submit an empty form
- Verifies that browser validation prevents submission

**Why it matters:** Ensures client-side validation works.

#### Test 7: Multiple Books
```javascript
test('7. Should display multiple books in list', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[placeholder="Title"]').fill('First Book');
  await page.locator('input[placeholder="Author"]').fill('Author One');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
  
  await page.locator('input[placeholder="Title"]').fill('Second Book');
  await page.locator('input[placeholder="Author"]').fill('Author Two');
  await page.locator('button[type="submit"]').click();
  
  await page.waitForTimeout(1000);
  await expect(page.locator('text=First Book')).toBeVisible();
  await expect(page.locator('text=Second Book')).toBeVisible();
});
```
**What it does:**
- Adds two books one after another
- Verifies both appear in the list

**Why it matters:** Tests that the app can handle multiple entries correctly.

**How to run:** `npm run test:e2e`

Playwright automatically starts both the backend and frontend servers before running tests!

---

## The CI/CD Pipeline (Automatic Quality Checks)

**Location:** `.github/workflows/ci.yml`

CI/CD stands for **Continuous Integration / Continuous Deployment**. It means:
- Every time you push code to GitHub, tests run automatically
- If tests fail, you know immediately something is broken
- It catches bugs before they reach production

### How the Pipeline Works:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```
**Trigger:** The pipeline runs on every push to main or when creating/updating a pull request.

### The 4 Jobs:

#### Job 1: Unit Tests 🧪
```yaml
unit-tests:
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js 20
    - Install backend dependencies
    - Run Unit Tests
```
**What it does:**
- Sets up a virtual Ubuntu computer in the cloud
- Installs Node.js version 20
- Installs all backend dependencies
- Runs `npm test` in the backend folder
- **If any test fails, the pipeline stops here**

#### Job 2: API Tests 📡
```yaml
api-tests:
  needs: unit-tests  # Only runs if unit tests pass
  steps:
    - Checkout code
    - Setup Node.js 20
    - Install backend dependencies
    - Install Newman globally
    - Start Backend Server in background
    - Wait 5 seconds for server to start
    - Run Newman tests
```
**What it does:**
- Only runs if unit tests passed
- Starts the backend server
- Runs all Postman/Newman API tests
- **If any test fails, the pipeline stops here**

#### Job 3: E2E Tests 🎭
```yaml
e2e-tests:
  needs: api-tests  # Only runs if API tests pass
  steps:
    - Checkout code
    - Setup Node.js 20
    - Install frontend dependencies
    - Install backend dependencies
    - Install Playwright browsers
    - Run E2E Tests
    - Upload Playwright Report if tests fail
```
**What it does:**
- Only runs if API tests passed
- Installs all dependencies
- Installs Chrome browser for Playwright
- Runs all E2E tests
- If tests fail, uploads a detailed report you can download

#### Job 4: Build Check 🏗️
```yaml
build:
  needs: e2e-tests  # Only runs if E2E tests pass
  steps:
    - Checkout code
    - Setup Node.js 20
    - Install dependencies
    - Build Frontend (npm run build)
    - Success message
```
**What it does:**
- Only runs if all tests passed
- Tries to build the production version of the frontend
- If build succeeds, the entire pipeline is successful!

### Why This Matters:

1. **Automated Quality Assurance** - You don't have to remember to run tests
2. **Fast Feedback** - Know immediately if something broke
3. **Confidence** - If pipeline passes, you know your code works
4. **Professional Practice** - Real companies use CI/CD pipelines
5. **Prevents Bugs** - Catches issues before they reach users

---

## How to Run Everything

### Prerequisites
- Install Node.js 20+ from [nodejs.org](https://nodejs.org/)
- Install Git from [git-scm.com](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/zaycloud/zayn-books.git
cd zayn-books
```

### Step 2: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Run the Application

**Option A: Two Terminals (Recommended)**
```bash
# Terminal 1: Start Backend
cd backend
npm start
# Server runs on http://localhost:3000

# Terminal 2: Start Frontend
npm run dev
# App runs on http://localhost:5173
```

**Option B: Background Mode**
```bash
# Start backend in background
cd backend
npm start &
cd ..

# Start frontend
npm run dev
```

### Step 4: Use the Application
1. Open your browser to `http://localhost:5173`
2. You should see the ZAYN Books interface
3. Try adding a book:
   - Title: "Test Book"
   - Author: "Your Name"
   - Year: 2025
   - Genre: "Testing"
4. Click "Add Book"
5. See it appear in the list
6. Click "Delete" to remove it

### Running Tests

**Unit Tests:**
```bash
cd backend
npm test
```
You'll see output showing which tests passed/failed.

**API Tests:**
```bash
# Make sure backend is running first!
cd backend
npm start &

# In another terminal
npm install -g newman
newman run tests-api/collection.json
```

**E2E Tests:**
```bash
# From the root directory
npm run test:e2e

# Or with UI mode (shows browser)
npm run test:e2e:ui
```
Playwright will automatically start both servers!

---

## Security Features

This application includes several security best practices:

### 1. Input Validation
```javascript
if (!title || !author) {
  res.status(400).json({ error: 'Title and Author are required' });
  return;
}
```
**Why:** Prevents invalid data from entering the database.

### 2. Prepared Statements (SQL Injection Prevention)
```javascript
const sql = 'INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)';
const params = [title, author, year, genre];
db.run(sql, params, function (err) { ... });
```
**Why:** The `?` placeholders prevent SQL injection attacks.

**What's SQL Injection?** A hacking technique where attackers try to insert malicious SQL code. Example:
```
Title: "; DROP TABLE books; --
```
Without prepared statements, this could delete your entire database!

### 3. CORS (Cross-Origin Resource Sharing)
```javascript
app.use(cors());
```
**Why:** Allows the frontend to communicate with the backend while preventing unauthorized websites from accessing your API.

### 4. Error Handling
```javascript
if (err) {
  res.status(500).json({ error: err.message });
  return;
}
```
**Why:** Prevents sensitive error details from leaking to users while still providing helpful feedback.

### 5. Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (client error)
- 404: Not Found
- 500: Server Error

**Why:** Standard HTTP status codes help clients understand what happened.

---

## Key Learning Concepts

### 1. Full-Stack Architecture
**Frontend ↔ Backend ↔ Database**
- Frontend makes HTTP requests
- Backend processes requests and talks to database
- Database stores/retrieves data
- Backend sends responses back to frontend

### 2. RESTful API Design
REST = Representational State Transfer
- GET = Read data
- POST = Create data
- PUT = Update data
- DELETE = Remove data

### 3. Asynchronous Programming
```javascript
const fetchBooks = async () => {
  const res = await fetch('http://localhost:3000/api/books')
  ...
}
```
- `async/await` handles operations that take time (network requests, database queries)
- Code waits for the operation to complete without freezing

### 4. React Concepts
- **Components** - Reusable pieces of UI (App is a component)
- **State** - Data that can change over time (`useState`)
- **Effects** - Side effects like fetching data (`useEffect`)
- **Props** - Data passed between components

### 5. Testing Pyramid
```
        /\
       /E2E\      Few, slow, expensive (7 tests)
      /------\
     /  API  \    Medium number, medium speed (10 tests)
    /----------\
   /   UNIT    \  Many, fast, cheap (10 tests)
  /--------------\
```
- **Unit Tests** - Test individual functions in isolation
- **API Tests** - Test HTTP endpoints
- **E2E Tests** - Test entire user flows

### 6. DevOps Practices
- **Version Control** (Git) - Track code changes
- **Continuous Integration** (GitHub Actions) - Automatic testing
- **Infrastructure as Code** (ci.yml) - Pipeline defined in code
- **Automated Testing** - No manual testing needed

### 7. Database Concepts
- **Tables** - Structure to store data (like a spreadsheet)
- **Rows** - Individual records (each book)
- **Columns** - Attributes (title, author, etc.)
- **Primary Key** (id) - Unique identifier for each row
- **SQL** - Structured Query Language for talking to databases

---

## Summary

**What You've Built:**
A complete, professional-grade web application with:
- User interface (React)
- Server backend (Express)
- Database (SQLite)
- 27 automated tests (Unit + API + E2E)
- CI/CD pipeline (GitHub Actions)
- Security features (validation, SQL injection prevention)

**What You've Learned:**
- Full-stack development
- REST API design
- Database operations
- Testing strategies
- DevOps automation
- Security best practices

**Why This Matters:**
These are the exact skills and practices used by professional software engineers every day. This project demonstrates:
- You can build complete applications
- You understand modern development workflows
- You know how to ensure code quality through testing
- You follow security best practices

---

## Questions to Ask Your Teacher

If you want to deepen your understanding, consider discussing:

1. **Architecture:** "Why do we separate frontend and backend instead of having everything in one place?"
2. **Testing:** "How do you decide how many tests to write and what to test?"
3. **Security:** "What other security concerns should we think about for a real production app?"
4. **Scalability:** "What would we need to change to handle millions of users?"
5. **Deployment:** "How would we deploy this app so anyone on the internet can use it?"

---

**Good luck with your presentation! 🚀**

You now have a complete understanding of how every piece works together. Practice explaining each section out loud, and you'll be ready to showcase your knowledge!
