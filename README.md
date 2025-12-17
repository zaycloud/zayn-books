# 📚 ZAYN Books - Book Management Application

A fullstack Book Management application built with React, Express, and SQLite. This project demonstrates CI/CD pipeline setup, comprehensive test automation, and DevSecOps best practices.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **Database** | SQLite |
| **Unit Tests** | Vitest |
| **API Tests** | Newman (Postman) |
| **E2E Tests** | Playwright |
| **CI/CD** | GitHub Actions |

## 📁 Project Structure

```
final-assignment/
├── .github/workflows/   # CI/CD Pipeline
│   └── ci.yml
├── backend/             # Express API Server
│   ├── server.js        # Main server & routes
│   ├── database.js      # SQLite configuration
│   └── tests/           # Unit tests (Vitest)
├── src/                 # React Frontend
│   ├── App.jsx          # Main component
│   └── main.jsx         # Entry point
├── tests-api/           # API tests (Postman/Newman)
│   └── collection.json
├── tests-e2e/           # E2E tests (Playwright)
│   └── books.spec.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### Running the Application

```bash
# Terminal 1: Start backend (port 3000)
cd backend && npm start

# Terminal 2: Start frontend (port 5173)
npm run dev
```

Visit `http://localhost:5173` to use the app.

## 🧪 Running Tests

### Unit Tests (Vitest)
```bash
cd backend && npm test
```

### API Tests (Newman)
```bash
# Ensure backend is running first
npm install -g newman
newman run tests-api/collection.json
```

### E2E Tests (Playwright)
```bash
# This will start both servers automatically
npm run test:e2e

# Or with UI mode
npm run test:e2e:ui
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every push/PR to `main`:

```
┌─────────────┐     ┌─────────────┐
│  🔍 Lint    │     │ 🛡️ Security │   ← Parallel (kodkvalitet + säkerhet)
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 ▼
         ┌──────────────┐
         │ 🧪 Unit Tests │              ← Backend-logik (Vitest)
         └──────┬───────┘
                ▼
         ┌──────────────┐
         │ 📡 API Tests  │              ← REST endpoints (Newman)
         └──────┬───────┘
                ▼
   ┌────────────┼────────────┐
   ▼            ▼            ▼
┌────────┐ ┌─────────┐ ┌─────────┐
│Chromium│ │ Firefox │ │ WebKit  │    ← E2E Tests (Playwright) - PRODUCTION BUILD
└────┬───┘ └────┬────┘ └────┬────┘
     └──────────┼───────────┘
                ▼
        ┌──────────────┐
        │ 🏗️ Build      │              ← Final verification
        └──────────────┘
```

### Pipeline Jobs:

| Job | Tool | Description |
|-----|------|-------------|
| **Lint** | ESLint | Code quality & style check |
| **Security** | npm audit | Vulnerability scanning |
| **Unit Tests** | Vitest | Backend logic testing |
| **API Tests** | Newman | REST endpoint testing |
| **E2E Tests** | Playwright | Full user flow testing (3 browsers) |
| **Build** | Vite | Production build verification |

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### API Documentation (Request/Response)

#### GET /api/books
Retrieve all books from the database.

**Request:**
```bash
curl http://localhost:3000/api/books
```

**Response (200 OK):**
```json
{
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "year": 1937,
      "genre": "Fantasy"
    }
  ]
}
```

---

#### POST /api/books
Create a new book.

**Request:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "1984", "author": "George Orwell", "year": 1949, "genre": "Dystopian"}'
```

**Request Body (required fields marked with *):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | * | Book title |
| author | string | * | Author name |
| year | number | | Publication year |
| genre | string | | Book genre |

**Response (201 Created):**
```json
{
  "message": "success",
  "data": {
    "id": 2,
    "title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Dystopian"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Title and Author are required"
}
```

---

#### PUT /api/books/:id
Update an existing book.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "The Hobbit (Updated)", "author": "J.R.R. Tolkien", "year": 1937, "genre": "Fantasy"}'
```

**Response (200 OK):**
```json
{
  "message": "success",
  "data": {
    "id": 1,
    "title": "The Hobbit (Updated)",
    "author": "J.R.R. Tolkien",
    "year": 1937,
    "genre": "Fantasy"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Book not found"
}
```

---

#### DELETE /api/books/:id
Delete a book by ID.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

**Response (200 OK):**
```json
{
  "message": "deleted"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Book not found"
}
```

---

### HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation failed (missing title/author) |
| 404 | Not Found | Book ID doesn't exist |
| 500 | Server Error | Database error |

## 🔒 Security

- Input validation on all endpoints
- Prepared statements (SQL injection prevention)
- CORS configured for frontend communication
- Security audit available via `npm audit`

---

**Author:** Zayn  
**Course:** NBI - DevSecOps & Test Automation
