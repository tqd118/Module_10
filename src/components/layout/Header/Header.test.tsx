import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useUser } from "@/context/UserContext";
import Header from "@/components/layout/Header";

vi.mock("@/context/UserContext", () => ({ 
    useUser: vi.fn() 
}));

vi.mock("@/utils/getAssetUrl", () => ({ 
    getAssetUrl: (path?: string) => path ?? "" 
}));

const mockUser = {
    id: 1,
    username: "testName",
    firstName: "John",
    secondName: "Doe",
    profileImage: "avatar.png",
};

const headerComponent = (
    <MemoryRouter>
        <Header />
    </MemoryRouter>
);

describe("Header", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            setUser: vi.fn(),
            setUserId: vi.fn(),
            userId: null,
            user: null
        });
    });

    it("renders logo", () => {
        render(headerComponent);
        expect(screen.getByText("sidekick")).toBeInTheDocument();
    });

    it("shows Sign In and Sign Up links when user is unauthorized", () => {
        render(headerComponent);
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("hides auth links when user is authenticated", () => {
        vi.mocked(useUser).mockReturnValue({
            setUser: vi.fn(),
            setUserId: vi.fn(),
            userId: mockUser.id,
            user: mockUser
        });

        render(headerComponent);
        expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
        expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    });

    it("shows user full name when authenticated", () => {
        vi.mocked(useUser).mockReturnValue({
            setUser: vi.fn(),
            setUserId: vi.fn(),
            userId: mockUser.id,
            user: mockUser,
        });

        render(headerComponent);
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders burger menu button", () => {
        render(headerComponent);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens mobile menu when burger button is clicked", async () => {
        render(headerComponent);
        await userEvent.click(screen.getByRole("button"));

        const signUpLinks = screen.getAllByText("Sign Up");
        expect(signUpLinks.length).toBe(2);
    });

    it("closes mobile menu when overlay is clicked", async () => {
        render(headerComponent);
        await userEvent.click(screen.getByRole("button"));

        const overlay = document.querySelector("[class*='menuOverlay']") as HTMLElement;
        expect(overlay).toBeTruthy();
        await userEvent.click(overlay);

        expect(document.querySelector("[class*='menuOverlay']")).not.toBeInTheDocument();
    });

    it("shows profile links in mobile menu for authenticated user", async () => {
        vi.mocked(useUser).mockReturnValue({
            setUserId: vi.fn(),
            setUser: vi.fn(),
            userId: mockUser.id,
            user: mockUser
        });

        render(headerComponent);
        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText("Profile info")).toBeInTheDocument();
        expect(screen.getByText("Statistics")).toBeInTheDocument();
    });
});
