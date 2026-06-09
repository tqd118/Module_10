import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "@/components/features/PostForm";

vi.mock("@/context/UserContext", () => ({ useUser: vi.fn() }));
vi.mock("@/context/PostsContext", () => ({ usePostsContext: vi.fn() }));

import { useUser } from "@/context/UserContext";
import { usePostsContext } from "@/context/PostsContext";
import type { User } from "@/types/social";

const mockUser: User = { id: 1, username: "alice" };
const createPost = vi.fn().mockResolvedValue({});

describe("PostForm", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });
        vi.mocked(usePostsContext).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
            fetchPosts: vi.fn(),
            fetchPost: vi.fn(),
            createPost,
            updatePost: vi.fn(),
            deletePost: vi.fn(),
            toggleLike: vi.fn(),
        });
        createPost.mockClear();
    });

    it("renders heading", () => {
        render(<PostForm onClose={vi.fn()} />);
        expect(screen.getByText("Create a new post")).toBeInTheDocument();
    });

    it("renders description input", () => {
        render(<PostForm onClose={vi.fn()} />);
        expect(screen.getByPlaceholderText("Write description here...")).toBeInTheDocument();
    });

    it("renders Create button", () => {
        render(<PostForm onClose={vi.fn()} />);
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
        const onClose = vi.fn();
        render(<PostForm onClose={onClose} />);
        await userEvent.click(screen.getByText("✕"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("updates description input on typing", async () => {
        render(<PostForm onClose={vi.fn()} />);
        const input = screen.getByPlaceholderText("Write description here...");
        await userEvent.type(input, "My post description");
        expect(input).toHaveValue("My post description");
    });

    it("calls createPost and onClose on submit when description is filled", async () => {
        const onClose = vi.fn();
        render(<PostForm onClose={onClose} />);

        await userEvent.type(
            screen.getByPlaceholderText("Enter post title"),
            "My post title"
        );

        await userEvent.type(
            screen.getByPlaceholderText("Write description here..."),
            "My post description"
        );
        await userEvent.click(screen.getByText("Create"));

        expect(createPost).toHaveBeenCalledWith(
            expect.objectContaining({ content: "My post description", title: "My post title" })
        );
        expect(onClose).toHaveBeenCalled();
    });

    it("does not call createPost when description is empty", async () => {
        render(<PostForm onClose={vi.fn()} />);
        await userEvent.click(screen.getByText("Create"));
        expect(createPost).not.toHaveBeenCalled();
    });

    it("shows drag-and-drop area for image upload", () => {
        render(<PostForm onClose={vi.fn()} />);
        expect(screen.getByText("Select a file or drag and drop here")).toBeInTheDocument();
    });
});
