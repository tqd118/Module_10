import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUser } from "@/context/UserContext";
import { useProfile } from "./useProfile";
import { useInitAuth } from "./useInitAuth";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn(),
}));

vi.mock("./useProfile", () => ({
    useProfile: vi.fn(),
}));

describe("useInitAuth", () => {
    const setUser = vi.fn();
    const setUserId = vi.fn();
    const fetchMe = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        vi.mocked(useUser).mockReturnValue({
            setUser,
            setUserId,
            user: null,
            userId: null,
        });

        vi.mocked(useProfile).mockReturnValue({
            fetchMe,
            suggestedUsers: [],
            loading: false,
            updateProfile: vi.fn(),
            fetchSuggestedUsers: vi.fn(),
        });
    });

    it("sets ready to true immediately when no token in localStorage", async () => {
        const { result } = renderHook(() => useInitAuth());

        expect(localStorage.getItem("token")).toBeNull();
        await waitFor(() => expect(result.current.ready).toBe(true));

        expect(fetchMe).not.toHaveBeenCalled();
        expect(setUser).not.toHaveBeenCalled();
        expect(setUserId).not.toHaveBeenCalled();
    });

    it("fetches user and sets context when token exists", async () => {
        localStorage.setItem("token", "testToken");

        fetchMe.mockResolvedValue({ id: 1, username: "testUser" });

        const { result } = renderHook(() => useInitAuth());

        await waitFor(() => expect(result.current.ready).toBe(true));

        expect(fetchMe).toHaveBeenCalledTimes(1);
        expect(setUserId).toHaveBeenCalledWith(1);
        expect(setUser).toHaveBeenCalledWith({ id: 1, username: "testUser" });
    });

    it("clears token and user context when fetchMe fails", async () => {
        localStorage.setItem("token", "invalidToken");
        localStorage.setItem("userId", "1");
        localStorage.setItem("user", JSON.stringify({ id: 1 }));

        fetchMe.mockRejectedValue(new Error("Unauthorized"));

        const { result } = renderHook(() => useInitAuth());

        await waitFor(() => expect(result.current.ready).toBe(true));

        expect(fetchMe).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("userId")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
        expect(setUserId).toHaveBeenCalledWith(null);
        expect(setUser).toHaveBeenCalledWith(null);
    });

    it("sets ready to false before verification completes", async () => {
        localStorage.setItem("token", "testToken");
        fetchMe.mockResolvedValue({
            me: {
                id: 1,
                userName: "testName"
            }
        });

        const { result } = renderHook(() => useInitAuth());

        expect(result.current.ready).toBe(false);

        await act(async () => fetchMe({ id: 1, username: "testName" }));

        await waitFor(() => expect(result.current.ready).toBe(true));
    });
});