import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "./Login";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastsContext";
import { validateEmail, validatePassword } from "@/utils/validation";

const login = vi.fn();
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

const loginComponent = (
    <MemoryRouter initialEntries={["/login"]}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
    </MemoryRouter>
)

describe("Login", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({
            login,
            signup: vi.fn(),
            logout: vi.fn()
        });

        vi.mocked(useToast).mockReturnValue({
            showToast
        });

        vi.mocked(validateEmail).mockReturnValue("");
        vi.mocked(validatePassword).mockReturnValue("");
    });

    it("renders login form", () => {
        render(loginComponent);

        expect(
            screen.getByRole("button", { name: /sign in/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/forgot to create an account/i)
        ).toBeInTheDocument();
    });

    it("shows email validation error", async () => {
        vi.mocked(validateEmail).mockReturnValue("Email is not valid");

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "wrong@mail"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign in/i })
        );

        expect(login).not.toHaveBeenCalled();

        expect(
            screen.getByText("Email is not valid")
        ).toBeInTheDocument();
    });

    it("shows password validation error", async () => {
        vi.mocked(validatePassword)
            .mockReturnValue("Password too short");

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "123"
        );

        await user.click(screen.getByRole("button", { name: /sign in/i }));

        expect(login).not.toHaveBeenCalled();

        expect(
            screen.getByText("Password too short")
        ).toBeInTheDocument();
    });

    it("calls login with entered credentials", async () => {
        login.mockResolvedValue({
            id: 1
        });

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign in/i })
        );

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith(
                "test@mail.com",
                "password123"
            );
        });
    });

    it("redirects to home page after successful login", async () => {
        login.mockResolvedValue({
            id: 1
        });

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign in/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Home Page")
            ).toBeInTheDocument();
        });
    });

    it("shows success toast after successful login", async () => {
        login.mockResolvedValue({
            id: 1
        });

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /sign in/i })
        );

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith(
                "Succesfuly sign in",
                "success"
            );
        });
    });

    it("shows server error when login fails", async () => {
        login.mockRejectedValue(
            new Error("Incorrect email or password")
        );

        render(loginComponent);

        await user.type(
            screen.getByLabelText(/email/i),
            "test@mail.com"
        );

        await user.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await user.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText("Incorrect email or password"))
                .toBeInTheDocument();
        });
    });
});