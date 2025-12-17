const request = require('supertest');
// const { describe, it, expect } = require('vitest'); // Globals are injected automatically
const app = require('../server'); // We import the app directly

describe('Backend API Unit Tests', () => {
  let createdBookId;

  // Test 1: GET /api/books (Empty State)
  it('1. Should return empty list initially', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  // Test 2: POST /api/books (Success)
  it('2. Should create a valid book', async () => {
    const newBook = { title: 'The Hobbit', author: 'Tolkien', year: 1937, genre: 'Fantasy' };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.title).toBe('The Hobbit');
    createdBookId = res.body.data.id; // Save ID for later tests
  });

  // Test 3: POST /api/books (Validation Failure - Title)
  it('3. Should fail if Title is missing', async () => {
    const badBook = { author: 'Tolkien' };
    const res = await request(app).post('/api/books').send(badBook);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('required');
  });

  // Test 4: POST /api/books (Validation Failure - Author)
  it('4. Should fail if Author is missing', async () => {
    const badBook = { title: 'The Hobbit' };
    const res = await request(app).post('/api/books').send(badBook);
    expect(res.statusCode).toBe(400);
  });

  // Test 5: GET /api/books (Verify Data Persistence)
  it('5. Should return the book we just added', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toBe('The Hobbit');
  });

  // Test 6: PUT /api/books/:id (Success)
  it('6. Should update an existing book', async () => {
    const updateData = { title: 'The Lord of the Rings', author: 'Tolkien', year: 1954, genre: 'Fantasy' };
    const res = await request(app).put(`/api/books/${createdBookId}`).send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('The Lord of the Rings');
  });

  // Test 7: PUT /api/books/:id (Not Found)
  it('7. Should fail update for non-existent ID', async () => {
    const res = await request(app).put('/api/books/9999').send({ title: 'Ghost', author: 'Nobody' });
    expect(res.statusCode).toBe(404);
  });

  // Test 8: PUT /api/books/:id (Validation Failure)
  it('8. Should fail update if validation fails', async () => {
    const res = await request(app).put(`/api/books/${createdBookId}`).send({ year: 2000 }); // Missing title/author
    expect(res.statusCode).toBe(400);
  });

  // Test 9: DELETE /api/books/:id (Success)
  it('9. Should delete a book', async () => {
    const res = await request(app).delete(`/api/books/${createdBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('deleted');
  });

  // Test 10: DELETE /api/books/:id (Not Found)
  it('10. Should fail delete for non-existent ID', async () => {
    const res = await request(app).delete(`/api/books/${createdBookId}`); // Already deleted
    expect(res.statusCode).toBe(404);
  });
});
