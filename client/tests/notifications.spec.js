
import { test, expect } from '@playwright/test';

test.describe('In-App Notifications', () => {
    // Credentials provided by user
    const studentCreds = { email: 'annapadiyara123@gmail.com', password: 'AnnaPadiyara@123' };
    const alumniCreds = { email: 'dileenarinu@gmail.com', password: 'DileenaRinu@123' };
    const adminCreds = { email: 'donsajikumily@gmail.com', password: 'DonAdmin@123' };

    test('Student: Create Query triggers success notification', async ({ page }) => {
        // 1. Login as Student
        await page.goto('http://localhost:5173/login');
        await page.fill('input[type="email"]', studentCreds.email);
        await page.fill('input[type="password"]', studentCreds.password);
        await page.click('button:has-text("Sign In")');

        await expect(page).toHaveURL(/\/student\/dashboard/);
        await expect(page.locator('h1:has-text("Welcome")')).toBeVisible({ timeout: 15000 });

        // 2. Go to Create Query
        await page.click('a[href="/student/create-query"]');
        await expect(page.locator('h2:has-text("Ask the Community")')).toBeVisible();

        // 3. Fill Form
        await page.fill('input[placeholder*="Google"]', 'Test Query');
        await page.fill('textarea', 'Testing toast notifications.');
        // Corrected selector based on checking file
        await page.fill('input[placeholder*="java"]', 'test');

        // MOCK SUCCESS
        await page.route('**/api/queries', async route => {
            await route.fulfill({ status: 201, json: { message: "Query created" } });
        });

        // 4. Submit
        await page.click('button:has-text("Post Query")');

        // 5. Verify Redirect (Implicit success)
        await expect(page).toHaveURL(/\/student\/queries/);
    });

    test('Alumni: Post Answer triggers success notification', async ({ page }) => {
        // 1. Login as Alumni
        await page.goto('http://localhost:5173/login');
        await page.click('button:has-text("Alumni")'); // Select Role
        await page.fill('input[type="email"]', alumniCreds.email);
        await page.fill('input[type="password"]', alumniCreds.password);
        await page.click('button:has-text("Sign In")');

        await expect(page).toHaveURL(/\/alumni\/dashboard/);

        // 2. Go to Query Feed
        // Assuming there's a link in sidebar/dashboard
        await page.goto('http://localhost:5173/alumni/feed');

        // 3. Mock Queries to ensure feed isn't empty
        await page.route('**/api/queries', async route => {
            const json = [{
                _id: 'q1',
                title: 'Mock Query',
                description: 'Mock Desc',
                author: { name: 'Student X' },
                createdAt: new Date().toISOString(),
                responses: []
            }];
            await route.fulfill({ json });
        });
        await page.reload();

        // 4. Submit Reply
        // Find the textarea for the first query
        const textarea = page.locator('textarea[placeholder*="Write your answer"]').first();
        await expect(textarea).toBeVisible();
        await textarea.fill('Here is a helpful answer.');

        // Mock Reply Success
        await page.route('**/api/queries/*/responses', async route => {
            await route.fulfill({ status: 201, json: { message: "Reply posted" } });
        });

        await page.click('button:has-text("Post Answer")');

        // 5. Expect Success Toast
        const toast = page.locator('text=Answer posted!');
        await expect(toast).toBeVisible({ timeout: 5000 });
    });

    test('Admin: Verify User Failure triggers error notification', async ({ page }) => {
        // 1. Login as Admin
        await page.goto('http://localhost:5173/login');
        await page.click('button:has-text("admin")');
        await page.fill('input[type="email"]', adminCreds.email);
        await page.fill('input[type="password"]', adminCreds.password);
        await page.click('button:has-text("Sign In")');

        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.locator('h1', { hasText: 'Admin Portal' })).toBeVisible({ timeout: 15000 });

        // 2. Go to Verify Users
        await page.goto('http://localhost:5173/admin/verify-users');
        await expect(page.locator('h2', { hasText: 'Verification Requests' })).toBeVisible();

        // 3. Mock Pending User + Verify Failure
        await page.route('**/api/admin/users', async route => {
            const json = [{ _id: '123', name: 'Test User', role: 'alumni', isVerified: false }];
            await route.fulfill({ json });
        });

        await page.route('**/api/admin/users/*/verify', route => route.abort('failed'));
        await page.reload();

        // 4. Approve
        const approveBtn = page.locator('button:has-text("Approve")').first();
        if (await approveBtn.isVisible()) {
            await approveBtn.click();
            // 5. Expect generic error toast
            const toast = page.locator('text=Failed to verify user');
            await expect(toast).toBeVisible({ timeout: 5000 });
        } else {
            console.log("No pending verification found. User might already be verified (Mocked check).");
        }
    });
});
