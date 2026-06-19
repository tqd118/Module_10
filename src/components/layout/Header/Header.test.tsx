import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/layout/Header";

vi.mock("@/context/UserContext", () => ({ useUser: vi.fn() }));
vi.mock("@/utils/getAssetUrl", () => ({ getAssetUrl: (path?: string) => path ?? "" }));

import { useUser } from "@/context/UserContext";
import type { User } from "@/types/social";

const mockUser: User = {
    id: 1,
    username: "alice",
    firstName: "Alice",
    secondName: "Smith",
    profileImage: "avatar.png",
};

function renderHeader() {
    return render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    );
}

describe("Header", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });
    });

    it("renders logo link", () => {
        renderHeader();
        expect(screen.getByText("sidekick")).toBeInTheDocument();
    });

    it("shows Sign In and Sign Up links when user is not authenticated", () => {
        renderHeader();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("hides auth links when user is authenticated", () => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });

        renderHeader();
        expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
        expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
    });

    it("shows user full name when authenticated", () => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });

        renderHeader();
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    it("renders burger menu button", () => {
        renderHeader();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens mobile menu when burger button is clicked", async () => {
        renderHeader();
        await userEvent.click(screen.getByRole("button"));

        const signUpLinks = screen.getAllByText("Sign Up");
        expect(signUpLinks.length).toBeGreaterThan(0);
    });

    it("closes mobile menu when overlay is clicked", async () => {
        renderHeader();
        await userEvent.click(screen.getByRole("button"));

        const overlay = document.querySelector("[class*='menuOverlay']") as HTMLElement;
        expect(overlay).toBeTruthy();
        await userEvent.click(overlay);

        expect(document.querySelector("[class*='menuOverlay']")).not.toBeInTheDocument();
    });

    it("shows profile links in mobile menu for authenticated user", async () => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });

        renderHeader();
        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText("Profile info")).toBeInTheDocument();
        expect(screen.getByText("Statistics")).toBeInTheDocument();
    });
});
