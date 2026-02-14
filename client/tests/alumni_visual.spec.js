import { test, expect } from '@playwright/test';

test.describe('Alumni Features', () => {
    let userEmail;

    test.beforeEach(async ({ page }) => {
        // Generate unique email for each run
        userEmail = `alumni_visual_${Date.now()}@test.com`;
    });

    test('should register, use roadplan, and earn profile points', async ({ page }) => {
        test.setTimeout(60000);
        // 1. Register
        await page.goto('/register');
        await expect(page.getByText('Join the Community')).toBeVisible({ timeout: 10000 });

        await page.fill('input[name="name"]', 'Visual Tester');
        await page.fill('input[name="email"]', userEmail);
        await page.fill('input[name="password"]', 'password123');

        // Select Role: Click the Alumni card
        await page.getByText('I am an Alumni').click();

        // If there are other required fields, fill them. 
        // Assuming simple registration based on code review.

        await page.click('button[type="submit"]');

        // Wait for navigation or successful login
        // Usually redirects to '/login' or directly to dashboard
        // If redirects to login:
        if (page.url().includes('/login')) {
            await page.fill('input[type="email"]', userEmail);
            await page.fill('input[type="password"]', 'password123');
            // Select Role in Login (if consistent with Register/Login UI)
            // Using logic from Login.jsx: <button>alumni</button>
            await page.getByRole('button', { name: 'alumni' }).click();
            await page.click('button[type="submit"]');
        }

        // Should be at dashboard
        await expect(page).toHaveURL(/.*\/alumni\/dashboard/);
        await expect(page.getByText('Welcome back, Visual')).toBeVisible();

        // 2. Test Points Progress Widget
        // Check if widget is visible
        await expect(page.getByText('Your Progress')).toBeVisible();

        // Check for Progress Bar presence
        // Target the rounded full container
        const progressBarContainer = page.locator('.h-3.w-full.bg-slate-100');
        await expect(progressBarContainer).toBeVisible();

        // The gradient bar might start with width 0 due to animation. 
        // We check it exists in the DOM.
        const gradientBar = progressBarContainer.locator('div[class*="bg-gradient-to-r"]');
        await expect(gradientBar).toBeAttached();

        // 3. Test Profile Completion Points (and history modal)
        // 3. Test Profile Completion Points (and history modal)
        await page.click('div[class*="cursor-pointer"]'); // Click the widget to open modal
        await expect(page.getByText('Your Journey')).toBeVisible(); // Modal Title

        // Close modal by clicking outside (backdrop)
        // The backdrop covers the screen. Clicking top-left (0,0) should work.
        await page.mouse.click(10, 10);

        // Wait for modal to disappear
        await expect(page.getByText('Your Journey')).toBeHidden();

        // 3. Test Profile Completion Points
        await page.goto('/alumni/profile');

        // Click Edit Profile Button (Update selector based on AlumniProfile.jsx)
        await page.getByText('Edit Profile').click();

        // Fill Profile
        await page.fill('textarea[name="bio"]', 'Visual Test Bio');
        await page.fill('input[name="skills"]', 'Visual Testing, Automation'); // Text input

        await page.fill('input[name="company"]', 'Visual Corp');
        await page.fill('input[name="jobTitle"]', 'Visual Tester');
        await page.fill('input[name="location"]', 'Screen');
        await page.fill('input[name="linkedin"]', 'https://linkedin.com/in/visual');

        // Click Save Changes in Modal
        await page.click('button:has-text("Save Changes")');

        // Check Points on Dashboard
        await page.goto('/alumni/dashboard');

        // Find the card with "Community Points"
        const pointsCard = page.locator('.bg-white', { has: page.getByText('Community Points') });
        const pointsValue = await pointsCard.locator('.text-3xl').textContent();

        await expect(pointsCard.locator('.text-3xl')).toHaveText('50', { timeout: 10000 });
    });
});
