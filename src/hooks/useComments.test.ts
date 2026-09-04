import { describe, it, expect, vi, beforeEach } from "vitest";
import { gql } from "@/api/graphql";
import { useComments } from "./useComments";
import { act, renderHook } from "@testing-library/react";

vi.mock("@/api/graphql", () => ({
    gql: vi.fn(),
}));

describe("useComments", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetch all comments for a specified post", async () => {
        vi.mocked(gql).mockResolvedValue({
            postComments: [
                { id: 1, text: "first comment" },
                { id: 2, text: "second comment" },
                { id: 3, text: "third comment" },
            ],
        });

        const { result } = renderHook(() => useComments());
        await act(() => result.current.fetchPostComments(1));

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.comments).toEqual([
            { id: 1, text: "first comment" },
            { id: 2, text: "second comment" },
            { id: 3, text: "third comment" },
        ]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("sets a local error when comments fetch fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useComments());
        await act(() => result.current.fetchPostComments(1));

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.error).toBe("request error");
        expect(result.current.comments).toEqual([]);
    });

    it("creates new comment for a post", async () => {
        vi.mocked(gql).mockResolvedValue({
            createComment: {
                id: 1,
                text: "new comment",
            },
        });

        const { result } = renderHook(() => useComments());
        await act(async () => {
            await result.current.createComment(1, "comment");
            await result.current.createComment(1, "comment");
        });

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.comments).toEqual([
            { id: 1, text: "new comment" },
            { id: 1, text: "new comment" },
        ]);
    });

    it("throw an error when comment creating fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useComments());

        await expect(
            result.current.createComment(1, "new comment")
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    })

    it("updates specified comment for a post", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createComment: {
                    id: 1,
                    text: "comment",
                },
            })
            .mockResolvedValueOnce({
                updateComment: {
                    id: 1,
                    text: "updated comment",
                },
            });

        const { result } = renderHook(() => useComments());

        await act(() => result.current.createComment(1, "comment"));

        expect(result.current.comments).toEqual([{ id: 1, text: "comment" }]);

        await act(() => result.current.updateComment(1, { text: "comment" }));

        expect(result.current.comments).toEqual([
            { id: 1, text: "updated comment" },
        ]);

        expect(gql).toHaveBeenCalledTimes(2);
    });

    it("throws an error when updating fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useComments());

        await expect(
            result.current.updateComment(1, { text: "new" })
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("deletes specified comment for a post", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createComment: {
                    id: 1,
                    text: "comment",
                },
            })
            .mockResolvedValueOnce({
                deleteComment: {
                    success: true,
                },
            });

        const { result } = renderHook(() => useComments());

        await act(() => result.current.createComment(1, "comment"));
        await act(() => result.current.deleteComment(1));

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.comments).toEqual([]);
    });

    it("throws an error when deletion fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useComments());

        await expect(result.current.deleteComment(1)).rejects.toThrow(
            "request error",
        );
        expect(gql).toHaveBeenCalledTimes(1);
    });
});
