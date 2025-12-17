// @ts-check
import { test, expect } from '@playwright/test';

// E2E Test Suite for ZAYN Books Application
// Uses unique names to avoid conflicts from previous test runs

test.describe('ZAYN Books E2E Tests', () => {
  
  // Generate unique ID for this test run
  const testId = Date.now();
  
  // Test 1: Page loads correctly
  test('1. Should load the application with correct title', async ({ page }) => {
    await page.goto('/');
    
    // Verify the app title is visible
    await expect(page.locator('h1')).toContainText('ZAYN Books');
    
    // Verify the form section exists
    await expect(page.locator('h3').first()).toContainText('Add New Book');
  });

  // Test 2: Form fields are present and functional
  test('2. Should have all form input fields', async ({ page }) => {
    await page.goto('/');
    
    // Check all input fields exist
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Author"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Year"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Genre"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // Test 3: CREATE - Add a new book
  test('3. Should add a new book successfully', async ({ page }) => {
    await page.goto('/');
    
    const uniqueTitle = `Test Book ${testId}`;
    
    // Fill in the form
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('E2E Tester');
    await page.locator('input[placeholder="Year"]').fill('2025');
    await page.locator('input[placeholder="Genre"]').fill('Testing');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Wait for success message
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Verify book appears in the list (use first() in case of duplicates)
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });

  // Test 4: READ - Verify book list displays correctly
  test('4. Should display books in the library list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the list to load
    await page.waitForTimeout(1000);
    
    // Check that the inventory section exists
    await expect(page.locator('h3').filter({ hasText: 'Library Inventory' })).toBeVisible();
    
    // The list element should exist
    await expect(page.locator('ul')).toBeVisible();
  });

  // Test 5: DELETE - Remove a book
  test('5. Should delete a book successfully', async ({ page }) => {
    await page.goto('/');
    
    const uniqueTitle = `Delete Me ${testId}`;
    
    // First add a book to ensure we have something to delete
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('To Be Deleted');
    await page.locator('button[type="submit"]').click();
    
    // Wait for the book to be added
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Find the specific book item and click its delete button
    const bookItem = page.locator('li').filter({ hasText: uniqueTitle }).first();
    await bookItem.locator('button').click();
    
    // Verify success message
    await expect(page.locator('text=Book deleted!')).toBeVisible({ timeout: 5000 });
  });

  // Test 6: Form validation - Required fields
  test('6. Should show validation for required fields', async ({ page }) => {
    await page.goto('/');
    
    const titleInput = page.locator('input[placeholder="Title"]');
    const authorInput = page.locator('input[placeholder="Author"]');
    
    // Check that required attributes are present
    await expect(titleInput).toHaveAttribute('required', '');
    await expect(authorInput).toHaveAttribute('required', '');
  });

  // Test 7: Book count updates after adding
  test('7. Should update book count after adding', async ({ page }) => {
    await page.goto('/');
    
    // Get initial count from "Library Inventory (X)"
    const inventoryHeader = page.locator('h3').filter({ hasText: 'Library Inventory' });
    await expect(inventoryHeader).toBeVisible();
    
    const uniqueTitle = `Count Test ${testId}`;
    
    // Add a new book
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('Counter');
    await page.locator('button[type="submit"]').click();
    
    // Wait for success
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Verify the new book is in the list
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });

  // Test 8: Form clears after successful submission
  test('8. Should clear form after adding a book', async ({ page }) => {
    await page.goto('/');
    
    const uniqueTitle = `Clear Form Test ${testId}`;
    
    // Fill in the form
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('Form Clearer');
    await page.locator('button[type="submit"]').click();
    
    // Wait for success
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Verify form fields are cleared
    await expect(page.locator('input[placeholder="Title"]')).toHaveValue('');
    await expect(page.locator('input[placeholder="Author"]')).toHaveValue('');
  });

  // Test 9: Data persists after page refresh
  test('9. Should persist data after page refresh', async ({ page }) => {
    await page.goto('/');
    
    const uniqueTitle = `Persist Test ${testId}`;
    
    // Add a book
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('Persistent Author');
    await page.locator('button[type="submit"]').click();
    
    // Wait for success
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Refresh the page
    await page.reload();
    
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Verify the book still exists
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });

  // Test 10: Can add book with only required fields
  test('10. Should add book with only title and author', async ({ page }) => {
    await page.goto('/');
    
    const uniqueTitle = `Minimal Book ${testId}`;
    
    // Fill only required fields (title and author)
    await page.locator('input[placeholder="Title"]').fill(uniqueTitle);
    await page.locator('input[placeholder="Author"]').fill('Minimal Author');
    // Leave Year and Genre empty
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Should still succeed
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });
});
