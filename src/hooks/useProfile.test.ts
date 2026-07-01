import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUser } from "@/context/UserContext";
import { useProfile } from "./useProfile";
import { gql } from "@/api/graphql";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn(),
}));

vi.mock("@/api/graphql", () => ({
    gql: vi.fn(),
}));

describe("useProfile", () => {
    const setUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useUser).mockReturnValue({
            setUser,
            setUserId: vi.fn(),
            user: null,
            userId: null,
        });
    });

    it("updates profile and sets user in context", async () => {
        vi.mocked(gql).mockResolvedValue({
            updateProfile: {
                id: 1,
                username: "updatedUser",
                email: "updated@mail.ru",
            },
        });

        const { result } = renderHook(() => useProfile());
        await act(() => result.current.updateProfile({ username: "updatedUser" }));

        expect(gql).toHaveBeenCalledTimes(1);
        expect(setUser).toHaveBeenCalledWith({
            id: 1,
            username: "updatedUser",
            email: "updated@mail.ru",
        });
    });

    it("throws an error when profile update fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useProfile());

        await expect(
            result.current.updateProfile({ username: "newName" })
        ).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
        expect(setUser).not.toHaveBeenCalled();
    });

    it("fetches suggested users", async () => {
        vi.mocked(gql).mockResolvedValue({
            suggestedUsers: [
                { id: 1, username: "user1" },
                { id: 2, username: "user2" },
            ],
        });

        const { result } = renderHook(() => useProfile());
        await act(() => result.current.fetchSuggestedUsers());

        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.suggestedUsers).toEqual([
            { id: 1, username: "user1" },
            { id: 2, username: "user2" },
        ]);
        expect(result.current.loading).toBe(false);
    });

    it("throws an error when fetch suggested users fails", async () => {
        vi.mocked(gql).mockRejectedValue(new Error("request error"));

        const { result } = renderHook(() => useProfile());

        await expect(act(() => result.current.fetchSuggestedUsers()))
            .rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
        expect(result.current.suggestedUsers).toEqual([]);
    });

    it("fetches current user", async () => {
        vi.mocked(gql).mockResolvedValue({
            me: { id: 1, username: "currentUser", email: "me@mail.ru" },
        });

        const { result } = renderHook(() => useProfile());
        const user = await result.current.fetchMe();

        expect(gql).toHaveBeenCalledTimes(1);
        expect(user).toEqual({ id: 1, username: "currentUser", email: "me@mail.ru" });
    });

    it("throws an error when fetch current user fails", async () => {
        vi.mocked(gql).mockRejectedValue(
            new Error("request error")
        );

        const { result } = renderHook(() => useProfile());

        await expect(result.current.fetchMe()).rejects.toThrow("request error");
        expect(gql).toHaveBeenCalledTimes(1);
    });
});