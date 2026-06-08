import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Feed from "@/components/widgets/Feed";
import type { Post } from "@/types/social";

vi.mock("@/context/UserContext", () => ({ useUser: vi.fn() }));
vi.mock("@/context/PostsContext", () => ({ usePostsContext: vi.fn() }));
vi.mock("@/hooks/useComments", () => ({
    useComments: () => ({
        comments: [],
        fetchPostComments: vi.fn(),
        createComment: vi.fn(),
    }),
}));
vi.mock("@/utils/getAssetUrl", () => ({ getAssetUrl: (path?: string) => path ?? "" }));

import { useUser } from "@/context/UserContext";
import { usePostsContext } from "@/context/PostsContext";

const mockPost: Post = {
    id: 1,
    title: "Test post",
    content: "Post content here",
    authorId: 1,
    author: { id: 1, username: "alice", firstName: "Alice" },
    likesCount: 3,
    likedByUsers: [],
    commentsCount: 0,
    creationDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
};

const fetchPosts = vi.fn();

const basePostsContext = {
    posts: [] as Post[],
    loading: false,
    error: null,
    fetchPosts,
    fetchPost: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    toggleLike: vi.fn(),
};

describe("Feed", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });

        vi.mocked(usePostsContext).mockReturnValue(basePostsContext);

        fetchPosts.mockClear();
    });

    it("renders post cards when posts are available", () => {
        vi.mocked(usePostsContext).mockReturnValue({ ...basePostsContext, posts: [mockPost] });

        render(<Feed />);
        expect(screen.getByText("Post content here")).toBeInTheDocument();
    });

    it("renders multiple posts", () => {
        vi.mocked(usePostsContext).mockReturnValue({
            ...basePostsContext,
            posts: [mockPost, { ...mockPost, id: 2, content: "Second post content" }],
        });

        render(<Feed />);
        expect(screen.getByText("Post content here")).toBeInTheDocument();
        expect(screen.getByText("Second post content")).toBeInTheDocument();
    });

    it("renders nothing when loading", () => {
        vi.mocked(usePostsContext).mockReturnValue({ ...basePostsContext, loading: true });

        render(<Feed />);
        expect(screen.queryByRole("article")).not.toBeInTheDocument();
    });

    it("renders nothing when there is an error", () => {
        vi.mocked(usePostsContext).mockReturnValue({ ...basePostsContext, error: "Network error" });

        render(<Feed />);
        expect(screen.queryByRole("article")).not.toBeInTheDocument();
    });

    it("calls fetchPosts on mount", () => {
        render(<Feed />);
        expect(fetchPosts).toHaveBeenCalledTimes(1);
    });
});
