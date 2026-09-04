import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { gql } from "@/api/graphql";
import { usePosts } from "./usePosts";

vi.mock("@/api/graphql", () => ({
    gql: vi.fn(),
}));

describe("usePosts", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches all posts and sorts them by creation date descending", async () => {
        vi.mocked(gql).mockResolvedValue({
            allPosts: [
                { id: 1, title: "old post", creationDate: "2024-01-01T00:00:00Z" },
                { id: 2, title: "new post", creationDate: "2024-06-01T00:00:00Z" },
            ],
        });

        const { result } = renderHook(() => usePosts());
        await act(() => result.current.fetchPosts());

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.posts).toEqual([
            { id: 2, title: "new post", creationDate: "2024-06-01T00:00:00Z" },
            { id: 1, title: "old post", creationDate: "2024-01-01T00:00:00Z" },
        ])
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("sets a local error when fetching posts fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => usePosts());
        await act(() => result.current.fetchPosts());

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.error).toBe("request error");
        expect(result.current.posts).toEqual([]);
    });

    it("fetches info about post", async () => {
        vi.mocked(gql).mockResolvedValue({
            post: { id: 1, title: "post" },
        });

        const { result } = renderHook(() => usePosts());
        const post = await result.current.fetchPost(1);

        expect(gql).toHaveBeenCalledTimes(1);
        expect(post).toEqual({ id: 1, title: "post" });
    });

    it("throws an error when fetchPost fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => usePosts());

        await expect(result.current.fetchPost(1)).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("creates a new post and prepends it to the list", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: { id: 1, title: "first post", creationDate: "2024-01-01T00:00:00Z" },
            })
            .mockResolvedValueOnce({
                createPost: { id: 2, title: "second post", creationDate: "2024-06-01T00:00:00Z" },
            });

        const { result } = renderHook(() => usePosts());
        await act(async () => {
            await result.current.createPost({ title: "first post", content: "post content" });
            await result.current.createPost({ title: "second post", content: "post content" });
        });

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.posts).toEqual([
            { id: 2, title: "second post", creationDate: "2024-06-01T00:00:00Z" },
            { id: 1, title: "first post", creationDate: "2024-01-01T00:00:00Z" }
        ])
    });

    it("throws an error when createPost fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => usePosts());

        await expect(
            result.current.createPost({ title: "post", content: "content" })
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("updates specified post in the list", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: { id: 1, title: "original title", creationDate: "2024-01-01T00:00:00Z" },
            })
            .mockResolvedValueOnce({
                updatePost: { id: 1, title: "updated title", creationDate: "2024-01-01T00:00:00Z" },
            });

        const { result } = renderHook(() => usePosts());

        await act(() => result.current.createPost({ title: "original title", content: "content" }));

        expect(result.current.posts).toEqual([
            { id: 1, title: "original title", creationDate: "2024-01-01T00:00:00Z" },
        ]);

        await act(() => result.current.updatePost(1, { title: "updated title" }));

        expect(result.current.posts).toEqual([
            { id: 1, title: "updated title", creationDate: "2024-01-01T00:00:00Z" },
        ]);
        expect(gql).toHaveBeenCalledTimes(2);
    });

    it("throws an error when updatePost fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => usePosts());

        await expect(
            result.current.updatePost(1, { title: "new title" })
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("deletes specified post from the list", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: { id: 1, title: "post to delete", creationDate: "2024-01-01T00:00:00Z" },
            })
            .mockResolvedValueOnce({
                deletePost: { success: true },
            });

        const { result } = renderHook(() => usePosts());

        await act(() => result.current.createPost({ title: "post to delete", content: "..." }));
        await act(() => result.current.deletePost(1));

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.posts).toEqual([]);
    });

    it("throws an error when deletePost fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => usePosts());

        await expect(result.current.deletePost(1)).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("optimistically likes a post and sends mutation", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: {
                    id: 100,
                    title: "post",
                    likesCount: 0,
                    likedByUsers: [],
                    creationDate: "2024-01-01T00:00:00Z",
                },
            })
            .mockResolvedValueOnce({
                likePost: { id: 100, likesCount: 1, likedByUsers: [{ id: 1 }] },
            });

        const { result } = renderHook(() => usePosts());

        await act(() => result.current.createPost({ title: "post", content: "content" }));
        await act(() => result.current.toggleLike(100, false, { id: 1, username: "user" }));

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.posts[0].likesCount).toBe(1);
        expect(result.current.posts[0].likedByUsers).toEqual([{ id: 1, username: "user" }]);
    });

    it("optimistically dislikes a post and sends mutation", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: {
                    id: 100,
                    title: "post",
                    likesCount: 1,
                    likedByUsers: [{ id: 1 }],
                    creationDate: "2024-01-01T00:00:00Z",
                },
            })
            .mockResolvedValueOnce({
                dislikePost: { id: 100, likesCount: 0, likedByUsers: [] },
            });

        const { result } = renderHook(() => usePosts());

        await act(() => result.current.createPost({ title: "post", content: "..." }));
        await act(() => result.current.toggleLike(100, true, { id: 1, username: "user" }));

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.posts[0].likesCount).toBe(0);
        expect(result.current.posts[0].likedByUsers).toEqual([]);
    });

    it("rolls back optimistic like update when toggleLike fails", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createPost: {
                    id: 100,
                    title: "post",
                    likesCount: 0,
                    likedByUsers: [],
                    creationDate: "2024-01-01T00:00:00Z",
                },
            })
            .mockRejectedValueOnce(new Error("request error"));

        const { result } = renderHook(() => usePosts());

        await act(() => result.current.createPost({ title: "post", content: "content" }));

        await expect(
            act(() => result.current.toggleLike(100, false, { id: 1, username: "user" }))
        ).rejects.toThrow("request error");

        expect(result.current.posts[0].likesCount).toBe(0);
        expect(result.current.posts[0].likedByUsers).toEqual([]);
    });
});