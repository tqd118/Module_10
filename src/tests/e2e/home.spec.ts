import { test, expect, type Page } from "@playwright/test";

const TEST_USER = {
    email: "helena.hills@social.com",
    password: "password789",
};


async function loginAs(page: Page, email: string, password: string) {
    await page.goto("/#/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/#\/$/);
}

test.describe("guest feed", () => {
    test("renders feed for quets", async ({ page }) => {
        await page.goto("/#/");

        const posts = page.getByRole("article");
        await expect(posts.first()).toBeVisible();
    });

    test("renders likes count and comment info for quest", async ({ page }) => {
        await page.goto("/#/");

        const firstPost = page.getByRole("article").first();

        await expect(firstPost).toBeVisible();
        await expect(firstPost.getByText(/likes/i)).toBeVisible();
        await expect(firstPost.getByText(/you have to login to see the comments/i)).toBeVisible();
    });
});


test.describe("authorized user", () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page, TEST_USER.email, TEST_USER.password);
    });

    test("renders user name and avatar in header", async ({ page }) => {
        const header = page.getByRole("banner");

        await expect(header.getByRole("link", { name: /sign in/i })).not.toBeVisible();
        await expect(header.locator("a[href*='profile']")).toBeVisible();
    });


    test("authorized user sees the post creation block", async ({ page }) => {
        await expect(page.getByText("What’s happening?")).toBeVisible();
        await expect(page.getByRole("button", { name: "Tell everyone" })).toBeVisible();
    });

    test("opens the create post modal by clicking 'Tell everyone'", async ({ page }) => {
        await page.getByRole("button", { name: "Tell everyone" }).click();
        await expect(page.getByText("Create a new post")).toBeVisible();
        await expect(page.getByPlaceholder("Write description here...")).toBeVisible();
    });

    test("creates a new post", async ({ page }) => {
        await page.getByRole("button", { name: "Tell everyone" }).click();
        await expect(page.getByText("Create a new post")).toBeVisible();

        await page.getByPlaceholder("Enter post title").fill("title")
        await page.getByPlaceholder("Write description here...").fill("test post content");

        await page.getByRole("button", { name: "Create" }).click();

        await expect(page.getByText("Create a new post")).not.toBeVisible();

        await expect(page.getByText("test post content")).toBeVisible();
    });

    test("closes the modal by clicking ✕", async ({ page }) => {
        await page.getByRole("button", { name: "Tell everyone" }).click();
        await expect(page.getByText("Create a new post")).toBeVisible();

        await page.getByRole("button", { name: "✕" }).click();

        await expect(page.getByText("Create a new post")).not.toBeVisible();
    });


    test("like increases the counter, repeated like decreases it", async ({ page }) => {
        const firstPost = page.getByRole("article").first();
        await expect(firstPost).toBeVisible();

        const likesLocator = firstPost.getByText(/\d+ likes/i);
        const beforeText = await likesLocator.textContent();
        const countBefore = parseInt(beforeText!);

        await firstPost.locator("[class*='likeIcon']").click();

        const afterText = await likesLocator.textContent();
        const countAfter = parseInt(afterText!);
        expect(Math.abs(countAfter - countBefore)).toBe(1);

        await firstPost.locator("[class*='likeIcon']").click();
        await expect(likesLocator).toHaveText(`${countBefore} likes`);
    });


    test("expands the comments section by clicking the arrow", async ({ page }) => {
        const firstPost = page.getByRole("article").first();

        const expander = firstPost.locator("[class*='expander']");
        await expect(expander).toBeVisible();

        await expander.click();

        await expect(firstPost.getByPlaceholder("Write description here...")).toBeVisible();
        await expect(firstPost.getByRole("button", { name: "Add a comment" })).toBeVisible();
    });

    test("adds a comment to the post", async ({ page }) => {
        const firstPost = page.getByRole("article").first();

        await firstPost.locator("[class*='expander']").click();

        await firstPost.getByPlaceholder("Write description here...").fill("test comment text");
        await firstPost.getByRole("button", { name: "Add a comment" }).click();

        await expect(firstPost.getByText("test comment text")).toBeVisible();
        await expect(firstPost.getByPlaceholder("Write description here...")).toHaveValue("");
    });
});