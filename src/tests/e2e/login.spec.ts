import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
    test("opens login page", async ({ page }) => {
        await page.goto("/Module_10/#/login");
        await expect(
            page.getByRole("button", { name: /Sign In/i })
        ).toBeVisible();
    });

    test("shows validation errors", async ({ page }) => {
        await page.goto("/Module_10/#/login");

        await page.getByRole("button", {
            name: /Sign In/i,
        }).click();

        await expect(page.getByText(/Email is/i)).toBeVisible();
    });

    test("allows entering credentials", async ({ page }) => {
        await page.goto("/Module_10/#/login");

        await page.fill('input[type="email"]', "test@test.com");

        await page.fill(
            'input[type="password"]',
            "123456"
        );

        await expect(
            page.locator('input[type="email"]')
        ).toHaveValue("test@test.com");

        await expect(
            page.locator('input[type="password"]')
        ).toHaveValue("123456");
    });
});