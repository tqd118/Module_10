import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
    test("opens successfully", async ({ page }) => {
        await page.goto("/Module_10/#/");

        await expect(page.locator("header")).toBeVisible();
    });

    test("displays posts feed", async ({ page }) => {
        await page.goto("/Module_10/#/");

        await expect(page.locator("article").first()).toBeVisible();
    });

    test("displays post content", async ({ page }) => {
        await page.goto("/Module_10/#/");

        const firstPost = page.locator("article").first();

        await expect(firstPost).toContainText(/\w+/);
    });

    test("shows sign in button for guests", async ({ page }) => {
        await page.goto("/Module_10/#/");

        await expect(
            page.getByRole("link", { name: /sign in/i })
        ).toBeVisible();
    });

    test("shows sign up button for guests", async ({ page }) => {
        await page.goto("/Module_10/#/");

        await expect(
            page.getByRole("link", { name: /sign up/i })
        ).toBeVisible();
    });
});