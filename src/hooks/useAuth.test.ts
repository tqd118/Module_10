import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "./useAuth";
import { gql } from "@/api/graphql";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn()
}));

vi.mock("@/api/graphql", () => ({
    gql: vi.fn()
}))

describe("useAuth", () => {
    const setUser = vi.fn();
    const setUserId = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        vi.mocked(useUser).mockReturnValue({
            setUser,
            setUserId,
            user: null,
            userId: null
        });
    });

    it("logs in user successfully", async () => {
        vi.mocked(gql).mockResolvedValue({
            login: {
                token: "testToken",
                user: {
                    id: 1,
                    username: "testName" 
                }
            }
        });

        const { result } = renderHook(() => useAuth());
        const user = await result.current.login(
            "test@test.com",
            "123456"
        );

        expect(user.username).toBe("testName");
        expect(localStorage.getItem("token")).toBe("testToken");
        expect(setUserId).toHaveBeenCalledWith(1);
        expect(setUser).toHaveBeenCalledWith({id: 1, username:"testName"});
    });

    it("throw an error when login fails", async () => {
        vi.mocked(gql).mockRejectedValue(
            new Error("Request error")
        );

        const { result } = renderHook(() => useAuth());
        await expect(result.current.login("test@mail.ru", "123")).rejects.toThrow("Request error");
    });

    it("signs up user successfuly", async () => {
        vi.mocked(gql).mockResolvedValue({
            signup: {
                message: "Successfuly sign up"
            }
        });

        const { result } = renderHook(() => useAuth());

        const message = await result.current.signup("test@mail.ru", "123");
        expect(message).toBe("Successfuly sign up");
        expect(setUser).not.toHaveBeenCalled();
        expect(setUserId).not.toHaveBeenCalled();
    });

    it("throw an error when signup fails", async () => {
        vi.mocked(gql).mockRejectedValue(
            new Error("Request error")
        );

        vi.mocked(useUser).mockReturnValue({
            setUser: vi.fn(),
            setUserId: vi.fn(),
            user: null,
            userId: null
        });

        const { result } = renderHook(() => useAuth());
        await expect(result.current.signup("test@mail.ru", "123")).rejects.toThrow("Request error");
    });

    it("send logout request to server and clear local user", async () => {
        vi.mocked(gql).mockResolvedValue({
            signup: {
                message: "Successfuly sign up"
            }
        });

        vi.mocked(useUser).mockReturnValue({
            setUser: vi.fn(),
            setUserId: vi.fn(),
            user: {
                id: 1,
                username: "testname"
            },
            userId: 1
        });

        const { result } = renderHook(() => useAuth());
        const {setUser, setUserId} = useUser();

        await result.current.logout();

        expect(gql).toHaveBeenCalledTimes(1);
        expect(setUser).toHaveBeenCalledWith(null);
        expect(setUserId).toHaveBeenCalledWith(null);
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("userId")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });
});