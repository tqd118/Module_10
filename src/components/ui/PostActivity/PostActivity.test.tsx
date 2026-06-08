import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostActivity from "@/components/ui/PostActivity";
import type { Post, User } from "@/types/social";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn(),
}));

vi.mock("@/hooks/useComments", () => ({
    useComments: () => ({
        comments: [],
        fetchPostComments: vi.fn(),
        createComment: vi.fn(),
    }),
}));

import { useUser } from "@/context/UserContext";

const mockUser: User = { id: 1, username: "alice" };

const mockPost: Post = {
    id: 10,
    title: "Test post",
    content: "Some content",
    authorId: 2,
    likesCount: 5,
    likedByUsers: [],
    commentsCount: 3,
    creationDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
};

describe("PostActivity", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });
    });

    it("shows likes count", () => {
        render(<PostActivity post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("5 likes")).toBeInTheDocument();
    });

    it("shows comments count for authenticated user", () => {
        render(<PostActivity post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("3 comments")).toBeInTheDocument();
    });

    it("shows login prompt for unauthenticated user", () => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });

        render(<PostActivity post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("You have to login to see the comments")).toBeInTheDocument();
        expect(screen.queryByText("3 comments")).not.toBeInTheDocument();
    });

    it("does not show expand checkbox for unauthenticated user", () => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });

        render(<PostActivity post={mockPost} onLike={vi.fn()} />);
        expect(screen.queryByRole("checkbox", { hidden: true })).not.toBeInTheDocument();
    });

    it("shows expand checkbox for authenticated user", () => {
        render(<PostActivity post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByRole("checkbox", { hidden: true })).toBeInTheDocument();
    });

    it("calls onLike when like icon is clicked", async () => {
        const onLike = vi.fn();
        render(<PostActivity post={mockPost} onLike={onLike} />);

        const likeIcon = document.querySelector("[class*='likeIcon']") as HTMLElement;
        await userEvent.click(likeIcon);

        expect(onLike).toHaveBeenCalledWith(mockPost.id, false, mockUser);
    });

    it("shows filled like icon when user has already liked the post", () => {
        const likedPost: Post = { ...mockPost, likedByUsers: [mockUser] };
        render(<PostActivity post={likedPost} onLike={vi.fn()} />);

        const likeIcon = document.querySelector("[class*='likeIcon']");
        expect(likeIcon?.className).toContain("icon-like-filled");
    });

    it("expands comment section on toggle click", async () => {
        render(<PostActivity post={mockPost} onLike={vi.fn()} />);

        const toggle = screen.getByRole("checkbox", { hidden: true });
        await userEvent.click(toggle);

        expect(screen.getByPlaceholderText("Write description here...")).toBeInTheDocument();
    });
});
