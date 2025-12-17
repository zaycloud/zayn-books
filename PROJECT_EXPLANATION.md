# 🎓 Final Assignment: ZAYN Books - Technical Documentation

> **Project:** Fullstack Book Management Application  
> **Stack:** React (Frontend) + Node.js/Express (Backend) + SQLite (Database)  
> **Quality Assurance:** 30+ Automated Tests (Unit, API, E2E) + CI/CD Pipeline

---

## 1. 🏗️ System Architecture

This application follows a standard **Client-Server Architecture** with a persistent database.

### 🖥️ Frontend (Client)
*   **Technology:** React.js (Vite)
*   **Role:** Handles user interaction, form submission, and data display.
*   **Key File:** `src/App.jsx`
*   **Communication:** Sends HTTP requests (`fetch`) to the Backend API.

### ⚙️ Backend (Server)
*   **Technology:** Node.js & Express.js
*   **Role:** Processes business logic, validates incoming data, and manages the database.
*   **Key File:** `backend/server.js`
*   **Security:** Implements CORS (Cross-Origin Resource Sharing) to allow frontend access.

### 🗄️ Database (Persistence)
*   **Technology:** SQLite (SQL)
*   **Role:** Stores book records permanently on disk.
*   **Key File:** `backend/database.js`
*   **Feature:** Uses an in-memory database (`:memory:`) during testing to prevent data corruption.

---

## 2. 🔌 API Documentation

The Backend exposes a RESTful API for the Frontend to consume.

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | Retrieve all books | N/A |
| **POST** | `/api/books` | Create a new book | `{ title, author, year, genre }` |
| **PUT** | `/api/books/:id` | Update a book | `{ title, author, ... }` |
| **DELETE** | `/api/books/:id` | Remove a book | N/A |

---

## 3. 🛡️ Quality Assurance (Testing Strategy)

I implemented a comprehensive testing strategy covering **3 distinct layers**, with over **30 automated tests** in total.

### Layer 1: 🧪 Unit Tests (Backend Logic)
**Tool:** Vitest  
**Focus:** Verifies that individual functions and API routes work in isolation.  
**Coverage (10 Tests):**
1.  `GET /api/books` returns empty list initially.
2.  `POST /api/books` successfully creates a valid book.
3.  `POST` fails when **Title** is missing (Validation).
4.  `POST` fails when **Author** is missing (Validation).
5.  `GET` retrieves the specific book just added.
6.  `PUT` successfully updates book details.
7.  `PUT` returns **404 Error** for non-existent ID.
8.  `PUT` returns **400 Error** for invalid data.
9.  `DELETE` successfully removes a book.
10. `DELETE` returns **404 Error** if book is already gone.

### Layer 2: 📡 API Tests (Integration)
**Tool:** Newman (Postman CLI)  
**Focus:** Tests the actual HTTP communication between a client and the running server.  
**Coverage (11 Tests):**
*   Verifies HTTP Status Codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
*   Validates JSON response structure (e.g., ensures `data` is an array).
*   Tests the full lifecycle: Create → Read → Update → Delete.
*   Ensures the server handles malformed JSON correctly.

### Layer 3: 🎭 End-to-End (E2E) Tests (User Experience)
**Tool:** Playwright  
**Focus:** Simulates a real user clicking buttons and typing in a browser.  
**Coverage (10 Tests):**
1.  **Page Load:** Verifies title and layout load correctly.
2.  **UI Elements:** Checks that all form inputs and buttons exist.
3.  **Create Flow:** User can type details, click "Add", and see the book appear.
4.  **Read Flow:** The inventory list displays books correctly.
5.  **Delete Flow:** User can click "Delete" and the book disappears.
6.  **Validation UI:** Browser shows "Required" warnings for empty fields.
7.  **Counter:** "Library Inventory (X)" count updates automatically.
8.  **UX:** Form clears itself after a successful submission.
9.  **Persistence:** Data remains visible after refreshing the page.
10. **Minimal Data:** User can add a book with only mandatory fields (Title/Author).

---

## 4. 🚀 CI/CD Pipeline (Automation)

I configured a **GitHub Actions** workflow (`.github/workflows/ci.yml`) to automate quality checks.

**Workflow Steps:**
1.  **Trigger:** Runs on every `push` to the `main` branch.
2.  **Build:** Installs dependencies for both Frontend and Backend.
3.  **Test:** Executes all 3 test suites in parallel/sequence.
    *   `npm run test:unit`
    *   `npm run test:api`
    *   `npm run test:e2e`
4.  **Result:** If *any* test fails, the code is rejected. This ensures the `main` branch is always stable.

---

## 5. 💻 How to Run

### Development Mode
```bash
# Terminal 1: Start Backend
npm run dev:backend

# Terminal 2: Start Frontend
npm run dev
```

### Running Tests
```bash
# Run Unit Tests
npm run test:unit

# Run API Tests (Requires backend running)
npm run test:api

# Run E2E Tests
npm run test:e2e

# Run ALL Tests
npm test
```
