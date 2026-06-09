import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword } from "./validation";

describe("validateEmail", () => {
    it("returns error for empty email", () => {
        expect(validateEmail("")).toBe("Email is required");
    });

    it("returns error for invalid email", () => {
        expect(validateEmail("abc")).toBe("Email is not valid");
        expect(validateEmail("abc@mail")).toBe("Email is not valid");
    });

    it("returns empty string for valid email", () => {
        expect(validateEmail("test@test.com")).toBe("");
    });
});

describe("validatePassword", () => {
    it("returns error for empty password", () => {
        expect(validatePassword("")).toBe("Password is required");
    });

    it("returns error for short password", () => {
        expect(validatePassword("123")).toBe("Password too short");
    });

    it("returns empty string for valid password", () => {
        expect(validatePassword("123456")).toBe("");
    });
});