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

1. **Unit Tests** - Vitest (Backend logic)
2. **API Tests** - Newman (REST endpoints)
3. **E2E Tests** - Playwright (Full user flows)
4. **Build Check** - Vite production build

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## 🔒 Security

- Input validation on all endpoints
- Prepared statements (SQL injection prevention)
- CORS configured for frontend communication
- Security audit available via `npm audit`

---

**Author:** Zayn  
**Course:** NBI - DevSecOps & Test Automation
