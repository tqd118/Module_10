import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Register from "./Register";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";
import { validateEmail, validatePassword } from "@/utils/validation";

const signup = vi.fn();
const showToast = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn()
}));

vi.mock("@/context/ToastsContext", () => ({
    useToast: vi.fn()
}));

vi.mock("@/utils/validation", () => ({
    validateEmail: vi.fn(),
    validatePassword: vi.fn()
}));

const registerComponent = (
    <MemoryRouter>
        <Register />
    </MemoryRouter>
)

describe("Register", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({
            signup,
            login: vi.fn(),
            logout: vi.fn()
        });

        vi.mocked(useToast).mockReturnValue({
            showToast
        });

        vi.mocked(validateEmail).mockReturnValue("");
        vi.mocked(validatePassword).mockReturnValue("");
    });

    it("renders registration form", () => {
        render(registerComponent);

        expect(
            screen.getByRole("button", { name: /sign up/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/already have an account/i)
        ).toBeInTheDocument();
    });

    it("shows email validation error", async () => {
        vi.mocked(validateEmail)
            .mockReturnValue("Email is not valid");

        render(registerComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "wrong@mail"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign up/i })
        );

        expect(signup).not.toHaveBeenCalled();

        expect(
            screen.getByText("Email is not valid")
        ).toBeInTheDocument();
    });

    it("shows password validation error", async () => {
        vi.mocked(validatePassword)
            .mockReturnValue("Password too short");

        render(registerComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign up/i })
        );

        expect(signup).not.toHaveBeenCalled();

        expect(
            screen.getByText("Password too short")
        ).toBeInTheDocument();
    });

    it("calls signup with entered credentials", async () => {
        signup.mockResolvedValue("Successfully registered");

        render(registerComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign up/i })
        );

        await waitFor(() => {
            expect(signup).toHaveBeenCalledWith(
                "test@mail.com",
                "password123"
            );
        });
    });

    it("shows success toast after successful registration", async () => {
        signup.mockResolvedValue("Successfully registered");

        render(registerComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign up/i })
        );

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith(
                "Succesfuly registered",
                "success"
            );
        });
    });

    it("shows server error when registration fails", async () => {
        signup.mockRejectedValue(
            new Error("Registration failed")
        );

        render(registerComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign up/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Registration failed")
            ).toBeInTheDocument();
        });
    });

    it("shows password strength hint for strong password", async () => {
        render(registerComponent);

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        expect(
            screen.getByText("Your password is strong")
        ).toBeInTheDocument();
    });

    it("does not show password strength hint for short password", async () => {
        render(registerComponent);

        await user.type(
            screen.getByLabelText(/password/i),
            "12345"
        );

        expect(
            screen.queryByText("Your password is strong")
        ).not.toBeInTheDocument();
    });
});