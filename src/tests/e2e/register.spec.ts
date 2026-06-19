import { test, expect } from "@playwright/test";

test.describe("Register page", () => {
    test("opens register page", async ({ page }) => {
        await page.goto("/Module_10/#/register");

        await expect(
            page.getByRole("button", { name: /Sign Up/i })
        ).toBeVisible();
    });

    test("shows validation errors", async ({ page }) => {
        await page.goto("/Module_10/#/register");

        await page.getByRole("button", {
            name: /Sign Up/i,
        }).click();

        await expect(page.getByText(/Email is/i)).toBeVisible();
    });

    test("allows filling form", async ({ page }) => {
        await page.goto("/Module_10/#/register");

        await page.fill(
            'input[type="email"]',
            "test@test.com"
        );

        await page.fill(
            'input[type="password"]',
            "123456"
        );

        await expect(
            page.locator('input[type="email"]')
        ).toHaveValue("test@test.com");
    });
});