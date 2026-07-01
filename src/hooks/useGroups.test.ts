import { describe, expect, it, vi, beforeEach } from "vitest";
import { gql } from "@/api/graphql";
import { renderHook, act } from "@testing-library/react";
import { useGroups } from "./useGroups";

vi.mock("@/api/graphql", () => ({
    gql: vi.fn(),
}));

describe("useGroups", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetch all groups", async () => {
        vi.mocked(gql).mockResolvedValue({
            allGroups: [
                { id: 1, title: "first group" },
                { id: 2, title: "second group" },
                { id: 3, title: "third group" },
            ],
        });

        const { result } = renderHook(() => useGroups());
        await act(() => result.current.fetchGroups());

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.groups).toEqual([
            { id: 1, title: "first group" },
            { id: 2, title: "second group" },
            { id: 3, title: "third group" },
        ]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("sets a local error when group fetch fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useGroups());
        await act(() => result.current.fetchGroups());

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.error).toBe("request error");
        expect(result.current.groups).toEqual([]);
    });

    it("fetch information about group", async () => {
        vi.mocked(gql).mockResolvedValue({
            group: {
                id: 1,
                title: "group title",
            },
        });

        const { result } = renderHook(() => useGroups());
        const group = await result.current.fetchGroup(1);

        expect(gql).toHaveBeenCalledTimes(1);
        expect(group).toEqual({ id: 1, title: "group title" });
    });

    it("throws an error when fetching fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useGroups());

        await expect(result.current.fetchGroup(1)).rejects.toThrow(
            "request error",
        );
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("creates new group", async () => {
        vi.mocked(gql).mockResolvedValue({
            createGroup: {
                id: 1,
                title: "new group",
                photo: "./photoImage.png"
            },
        });

        const { result } = renderHook(() => useGroups());
        await act(async () => {
            await result.current.createGroup({title: "title", photo: "./photoImage.png"});
            await result.current.createGroup({title: "title", photo: "./photoImage.png"});
        });

        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.groups).toEqual([
            { id: 1, title: "new group",  photo: "./photoImage.png"},
            { id: 1, title: "new group",  photo: "./photoImage.png"}
        ]);
    });

    it("throw an error when comment creating fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useGroups());

        await expect(
            result.current.createGroup({title: "title", photo: "./photoImage.png"})
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });

    it("updates specified group", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createGroup: {
                    id: 1,
                    title: "old title",
                    photo: "./old.png",
                },
            })
            .mockResolvedValueOnce({
                updateGroup: {
                    id: 1,
                    title: "new title",
                    photo: "./old.png",
                },
            });
 
        const { result } = renderHook(() => useGroups());
 
        await act(() => result.current.createGroup({title: "old title", photo: "./old.png"}));
 
        expect(result.current.groups).toEqual([{ id: 1, title: "old title", photo: "./old.png" }]);
 
        await act(() => result.current.updateGroup(1, { title: "new title" }));
 
        expect(result.current.groups).toEqual([
            { id: 1, title: "new title", photo: "./old.png" },
        ]);
        expect(gql).toHaveBeenCalledTimes(2);
    });
 
    it("throws an error when updating fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));
 
        const { result } = renderHook(() => useGroups());
 
        await expect(
            result.current.updateGroup(1, { title: "new title" })
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });
 
    it("deletes specified group", async () => {
        vi.mocked(gql)
            .mockResolvedValueOnce({
                createGroup: {
                    id: 1,
                    title: "group",
                    photo: "./photo.png",
                },
            })
            .mockResolvedValueOnce({
                deleteGroup: {
                    success: true,
                },
            });
 
        const { result } = renderHook(() => useGroups());
 
        await act(() => result.current.createGroup({title: "group", photo: "./photo.png"}));
        await act(() => result.current.deleteGroup(1));
 
        expect(gql).toHaveBeenCalledTimes(2);
        expect(result.current.groups).toEqual([]);
    });
 
    it("throws an error when deletion fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));
 
        const { result } = renderHook(() => useGroups());
 
        await expect(result.current.deleteGroup(1)).rejects.toThrow(
            "request error",
        );
        expect(gql).toHaveBeenCalledTimes(1);
    });
});
