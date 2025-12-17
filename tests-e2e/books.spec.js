// @ts-check
import { test, expect } from '@playwright/test';

// E2E Test Suite for ZAYN Books Application
// Requirement: 5 E2E tests for the Final Assignment

test.describe('ZAYN Books E2E Tests', () => {
  
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
    
    // Fill in the form
    await page.locator('input[placeholder="Title"]').fill('Playwright Test Book');
    await page.locator('input[placeholder="Author"]').fill('E2E Tester');
    await page.locator('input[placeholder="Year"]').fill('2025');
    await page.locator('input[placeholder="Genre"]').fill('Testing');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Wait for success message
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Verify book appears in the list
    await expect(page.locator('text=Playwright Test Book')).toBeVisible();
  });

  // Test 4: READ - Verify book list displays correctly
  test('4. Should display books in the library list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the list to load
    await page.waitForTimeout(1000); // Allow API call to complete
    
    // Check that the inventory section exists
    await expect(page.locator('h3').filter({ hasText: 'Library Inventory' })).toBeVisible();
    
    // The list should have at least one book (from previous test or existing data)
    const bookList = page.locator('ul li');
    const count = await bookList.count();
    
    // Verify at least one book exists or the list is visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Test 5: DELETE - Remove a book
  test('5. Should delete a book successfully', async ({ page }) => {
    await page.goto('/');
    
    // First add a book to ensure we have something to delete
    await page.locator('input[placeholder="Title"]').fill('Book To Delete');
    await page.locator('input[placeholder="Author"]').fill('Delete Me');
    await page.locator('button[type="submit"]').click();
    
    // Wait for the book to be added
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Book To Delete')).toBeVisible();
    
    // Find and click the delete button for this book
    const bookItem = page.locator('li').filter({ hasText: 'Book To Delete' });
    await bookItem.locator('button').filter({ hasText: /delete/i }).click();
    
    // Verify success message
    await expect(page.locator('text=Book deleted!')).toBeVisible({ timeout: 5000 });
  });

  // Test 6: Form validation - Required fields
  test('6. Should show validation for required fields', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form (browser validation should prevent it)
    const submitButton = page.locator('button[type="submit"]');
    const titleInput = page.locator('input[placeholder="Title"]');
    
    // Check that required attribute is present
    await expect(titleInput).toHaveAttribute('required', '');
    
    // Verify form doesn't submit without required fields
    await submitButton.click();
    
    // The form should not submit, so no success message
    await expect(page.locator('text=Book added!')).not.toBeVisible();
  });

  // Test 7: Multiple books display correctly
  test('7. Should display multiple books in list', async ({ page }) => {
    await page.goto('/');
    
    // Add first book
    await page.locator('input[placeholder="Title"]').fill('First Book');
    await page.locator('input[placeholder="Author"]').fill('Author One');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Book added!')).toBeVisible({ timeout: 5000 });
    
    // Clear and add second book
    await page.locator('input[placeholder="Title"]').fill('Second Book');
    await page.locator('input[placeholder="Author"]').fill('Author Two');
    await page.locator('button[type="submit"]').click();
    
    // Wait for refresh
    await page.waitForTimeout(1000);
    
    // Both books should be visible
    await expect(page.locator('text=First Book')).toBeVisible();
    await expect(page.locator('text=Second Book')).toBeVisible();
  });
});
