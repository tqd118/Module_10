import { test, expect } from "@playwright/test";

test.describe("Register page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/#/register");
    });

    test("renders register page", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
        await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
    });

    test("renders error when input fields are empty", async ({ page }) => {
        await page.getByRole("button", { name: /sign up/i }).click();

        await expect(page.getByText("Email is required")).toBeVisible();
        await expect(page.getByText("Password is required")).toBeVisible();
        await expect(page).toHaveURL(/#\/register/);
    });

    test("renders an error when email format is incorrect", async ({ page }) => {
        await page.getByLabel("Email").fill("test@mail");
        await page.getByLabel("Password").fill("password123");
        await page.getByRole("button", { name: /sign up/i }).click();

        await expect(page.getByText("Email is not valid")).toBeVisible();
    });

    test("renders error when password too short", async ({ page }) => {
        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("abc");
        await page.getByRole("button", { name: /sign up/i }).click();

        await expect(page.getByText("Password too short")).toBeVisible();
    });

    test("renders a hint when password is strong", async ({ page }) => {
        await page.getByLabel("Email").fill("test@example.com");
        await page.getByLabel("Password").fill("strongpassword");

        await expect(page.getByText("Your password is strong")).toBeVisible();
    });

    test("renders link to login page", async ({ page }) => {
        const signInLink = page.getByRole("link", { name: /sign in/i });

        await expect(signInLink).toBeVisible();
        await signInLink.click();
        await expect(page).toHaveURL(/#\/login/);
    });
});