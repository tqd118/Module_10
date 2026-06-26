import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProfileInfo from "./ProfileInfo";

import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastsContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { getAssetUrl } from "@/utils/getAssetUrl";
import userEvent from "@testing-library/user-event";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn(),
}));

vi.mock("@/context/ThemeContext", () => ({
    useTheme: vi.fn(),
}));

vi.mock("@/context/ToastsContext", () => ({
    useToast: vi.fn(),
}));

vi.mock("@/hooks/useProfile", () => ({
    useProfile: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));

vi.mock("@/utils/getAssetUrl", () => ({
    getAssetUrl: vi.fn()
}));

describe("ProfileInfo", () => {
    const updateProfile = vi.fn();
    const showToast = vi.fn();
    const toggle = vi.fn();
    const logout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useUser).mockReturnValue({ 
            setUser: vi.fn(), 
            setUserId: vi.fn(),
            user: {
                id: 1,
                firstName: "John",
                secondName: "Doe",
                username: "johndoe",
                email: "john@example.com",
                description: "Hello world",
                profileImage: "avatar.png",
            }, 
            userId: 1
        });
        vi.mocked(useTheme).mockReturnValue({ 
            theme: "light", 
            toggle 
        });
        vi.mocked(useToast).mockReturnValue({ showToast });
        vi.mocked(useProfile).mockReturnValue({ 
            updateProfile,
            fetchSuggestedUsers: vi.fn(),
            fetchMe: vi.fn(),
            suggestedUsers: [],
            loading: false
        });
        vi.mocked(useAuth).mockReturnValue({ 
            logout, 
            login: vi.fn(), 
            signup: vi.fn() 
        });
    });

    it("renders user data in inputs on mount", () => {
        render(<ProfileInfo />);

        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
        expect(screen.getByDisplayValue("johndoe")).toBeInTheDocument();
        expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Hello world")).toBeInTheDocument();
    });

    it("renders avatar from getAssetUrl when no local image selected", () => {
        vi.mocked(getAssetUrl).mockReturnValue("avatar.png");
        render(<ProfileInfo />);


        const avatar = screen.getByAltText("avatar") as HTMLImageElement;
        expect(avatar.src).toContain("avatar.png");
    });

    it("calls updateProfile with changed data on valid submit", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const usernameInput = screen.getByDisplayValue("johndoe");
        await user.clear(usernameInput);
        await user.type(usernameInput, "newusername");

        await user.click(screen.getByText("Save Profile Changes"));

        await waitFor(() => {
            expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ username: "newusername" }));
        });
    });

    it("shows success toast after successful profile update", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const usernameInput = screen.getByDisplayValue("johndoe");
        await user.clear(usernameInput);
        await user.type(usernameInput, "newusername");

        await user.click(screen.getByText("Save Profile Changes"));

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith("Profile info has been updated successfully", "success");
        });
    });

    it("does not call updateProfile when nothing has changed", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        await user.click(screen.getByText("Save Profile Changes"));

        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows error when username is empty and does not submit", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const usernameInput = screen.getByDisplayValue("johndoe");
        await user.clear(usernameInput);

        await user.click(screen.getByText("Save Profile Changes"));

        expect(await screen.findByText("Username is required")).toBeInTheDocument();
        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows error when full name is empty and does not submit", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const nameInput = screen.getByDisplayValue("John Doe");
        await user.clear(nameInput);
        await user.tab(); // trigger onBlur to mark fields as touched

        await user.click(screen.getByText("Save Profile Changes"));

        expect(await screen.findByText("First name is required")).toBeInTheDocument();
        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows error when username contains invalid characters and does not submit", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const usernameInput = screen.getByDisplayValue("johndoe");
        await user.clear(usernameInput);
        await user.type(usernameInput, "invalid name!");

        await user.click(screen.getByText("Save Profile Changes"));

        expect(await screen.findByText("Username must contain only letters, numbers and _")).toBeInTheDocument();
        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows error when email is empty and does not submit", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const emailInput = screen.getByDisplayValue("john@example.com");
        await user.clear(emailInput);

        await user.click(screen.getByText("Save Profile Changes"));

        expect(await screen.findByText("Email is required")).toBeInTheDocument();
        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows description limit warning when description exceeds 200 characters", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const textarea = screen.getByDisplayValue("Hello world");
        await user.clear(textarea);
        await user.type(textarea, "a".repeat(201));

        await user.click(screen.getByText("Save Profile Changes"));

        expect(await screen.findByText("Reached the 200 chars limit")).toBeInTheDocument();
        expect(updateProfile).not.toHaveBeenCalled();
    });

    it("shows description limit warning when at 200 chars", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        const textarea = screen.getByDisplayValue("Hello world");
        await user.clear(textarea);
        await user.type(textarea, "a".repeat(201));

        expect(screen.getByText("Reached the 200 chars limit")).toBeInTheDocument();
    });

    it("calls logout when logout form is submitted", async () => {
        const user = userEvent.setup();

        render(<ProfileInfo />);

        await user.click(screen.getByText("Logout"));

        expect(logout).toHaveBeenCalledTimes(1);
    });

    it("renders dark theme toggle as checked when theme is dark", () => {
        vi.mocked(useTheme).mockReturnValue({ 
            theme: "dark", 
            toggle 
        });

        render(<ProfileInfo />);

        const checkbox = document.querySelector("input[type='checkbox']") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });
});