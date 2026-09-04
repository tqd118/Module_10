import { describe, it, expect, vi } from "vitest";
import CreatePost from "./CreatePost";
import { useUser } from "@/context/UserContext";
import { render, screen } from "@testing-library/react";
import { getAssetUrl } from "@/utils/getAssetUrl";


vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn()
}));

vi.mock("@/utils/getAssetUrl", () => ({
    getAssetUrl: vi.fn()
}))

describe("CreatePost", () => {
    it("renders title and current user awatar", () => {
        vi.mocked(useUser).mockResolvedValue({
            user: {
                id: 1,
                username: "testName",
                profileImage: "avatar.png"
            },
            userId: 1,
            setUser: vi.fn(),
            setUserId: vi.fn()
        });

        vi.mocked(getAssetUrl).mockReturnValue("avatar.png")

        render(<CreatePost/>);
        expect(screen.getByText("What’s happening?")).toBeInTheDocument();
        expect(screen.getByAltText("avatar")).toHaveAttribute("src", "avatar.png")
    })
})