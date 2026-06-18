import { test, expect } from "@playwright/test";

const TEST_USER = {
	email: "helena.hills@social.com",
	password: "password789",
};

test.describe("Login page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/login");
	});

	test("renders login page", async ({ page }) => {
		await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Password")).toBeVisible();
		await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
	});

	test("renders errors when input fields are empty", async ({ page }) => {
		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page.getByText(/email/i).first()).toBeVisible();
		await expect(page.getByText(/password/i).first()).toBeVisible();
		await expect(page).toHaveURL(/#\/login/);
	});

	test("render error when email format is incorrect", async ({ page }) => {
		await page.getByLabel("Email").fill("test@mail");
		await page.getByLabel("Password").fill("somepassword");
		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page.getByText(/email is not valid/i)).toBeVisible();
	});

	test("successfuly logins and navigate to home page", async ({ page }) => {
		await page.getByLabel("Email").fill(TEST_USER.email);
		await page.getByLabel("Password").fill(TEST_USER.password);

		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page.getByText(/succesfuly sign in/i)).toBeVisible();
		await expect(page).toHaveURL(/#\/$/);
	});

	test("renders error when password is incorrect", async ({ page }) => {
		await page.getByLabel("Email").fill(TEST_USER.email);
		await page.getByLabel("Password").fill("wrongPassword");

		await page.getByRole("button", { name: /sign in/i }).click();

		await expect(page.getByText(/incorrect email or password/i)).toBeVisible();
		await expect(page).toHaveURL(/#\/login/);
	});

	test("renders link to register page", async ({ page }) => {
		const signUpLink = page.getByRole("link", { name: /sign up/i });

		await expect(signUpLink).toBeVisible();
		await signUpLink.click();
		await expect(page).toHaveURL(/#\/register/);
	});
});