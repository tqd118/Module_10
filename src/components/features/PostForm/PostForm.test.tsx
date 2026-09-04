import { beforeEach, it, expect, describe, vi } from 'vitest'
import { useUser } from "@/context/UserContext";
import { usePostsContext } from "@/context/PostsContext";
import { render, screen } from '@testing-library/react';
import PostForm from './PostForm';
import userEvent from '@testing-library/user-event';

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn()
}));

vi.mock("@/context/PostsContext", () => ({
    usePostsContext: vi.fn()
}));

describe("PostForm", () => {
    const createPost = vi.fn();
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useUser).mockReturnValue({
            user: {
                id: 1,
                username: "test"
            },
            userId: 1,
            setUser: vi.fn(),
            setUserId: vi.fn()
        });

        vi.mocked(usePostsContext).mockReturnValue({
            createPost,
            deletePost: vi.fn(),
            fetchPost: vi.fn(),
            fetchPosts: vi.fn(),
            toggleLike: vi.fn(),
            updatePost: vi.fn(),
            error: "",
            loading: false,
            posts: []
        });
    });

    it("renders input fields", () => {
        render(<PostForm onClose={vi.fn()}/>);

        expect(screen.getByLabelText("Post Title")).toBeInTheDocument();
        expect(screen.getByLabelText("Description")).toBeInTheDocument();
    });

    it("successfuly create a new post when both fields isn empty", async () => {
        render(<PostForm onClose={onClose}/>);

        const titleInput = screen.getByLabelText("Post Title");
        const descriptionInput = screen.getByLabelText("Description");

        await userEvent.type(titleInput, "post title");
        await userEvent.type(descriptionInput, "content");

        await userEvent.click(screen.getByRole("button", {name: "Create"}));

        expect(createPost).toHaveBeenCalledWith({
            title: "post title",
            content: "content"
        });
        expect(onClose).toHaveBeenCalledTimes(1);
    })

    it("do nothing when title field is empty", async () => {
        render(<PostForm onClose={onClose}/>);

        await userEvent.type(screen.getByLabelText("Description"), "content");
        await userEvent.click(screen.getByRole("button", {name: "Create"}));

        expect(createPost).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it("do nothing when content field is empty", async () => {
        render(<PostForm onClose={onClose}/>);

        await userEvent.type(screen.getByLabelText("Post Title"), "content");
        await userEvent.click(screen.getByRole("button", {name: "Create"}));

        expect(createPost).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    
});
