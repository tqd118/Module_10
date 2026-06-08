import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PostCard from "@/components/features/PostCard";
import type { Post } from "@/types/social";

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

vi.mock("@/utils/getAssetUrl", () => ({
    getAssetUrl: (path?: string) => path ?? "",
}));

import { useUser } from "@/context/UserContext";

const mockPost: Post = {
    id: 1,
    title: "Hello World",
    content: "This is post content",
    authorId: 42,
    author: {
        id: 42,
        username: "johndoe",
        firstName: "John",
        profileImage: "avatar.png",
    },
    likesCount: 10,
    likedByUsers: [],
    commentsCount: 2,
    creationDate: new Date(Date.now() - 5 * 60000).toISOString(),
    modifiedDate: new Date().toISOString(),
};

describe("PostCard", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });
    });

    it("renders post content", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("This is post content")).toBeInTheDocument();
    });

    it("renders author first name when available", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("renders author username when firstName is not set", () => {
        const post: Post = {
            ...mockPost,
            author: { id: 42, username: "johndoe", profileImage: "avatar.png" },
        };
        render(<PostCard post={post} onLike={vi.fn()} />);
        expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    it("renders avatar image with correct src", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        const avatar = screen.getByAltText("user");
        expect(avatar).toHaveAttribute("src", "avatar.png");
    });

    it("does not render post image when image is not provided", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        const images = screen.getAllByRole("img");
        expect(images).toHaveLength(1);
    });

    it("renders post image when provided", () => {
        const post: Post = { ...mockPost, image: "post-image.jpg" };
        render(<PostCard post={post} onLike={vi.fn()} />);
        const image = screen.getByAltText("");
        expect(image).toHaveAttribute("src", "post-image.jpg");
    });

    it("renders likes count", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByText("10 likes")).toBeInTheDocument();
    });

    it("renders as article element", () => {
        render(<PostCard post={mockPost} onLike={vi.fn()} />);
        expect(screen.getByRole("article")).toBeInTheDocument();
    });
});
