import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Suggestions from "./Suggestions";

import { useProfile } from "@/hooks/useProfile";
import { useGroups } from "@/hooks/useGroups";
import { getAssetUrl } from "@/utils/getAssetUrl";

vi.mock("@/hooks/useProfile", () => ({
    useProfile: vi.fn()
}));

vi.mock("@/hooks/useGroups", () => ({
    useGroups: vi.fn()
}));

vi.mock("@/utils/getAssetUrl", () => ({
    getAssetUrl: vi.fn()
}));

describe("Suggestions", () => {
    const fetchSuggestedUsers = vi.fn();
    const fetchGroups = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useProfile).mockReturnValue({
            loading: false,
            fetchSuggestedUsers,
            suggestedUsers: [
                {
                    id: 1,
                    username: "john",
                    photo: "john.png"
                },
                {
                    id: 2,
                    username: "alice",
                    photo: "alice.png"
                }
            ]
        });

        vi.mocked(useGroups).mockReturnValue({
            fetchGroups,
            groups: [
                {
                    id: 1,
                    title: "React Fans",
                    photo: "react.png",
                    membersCount: 1234
                }
            ],
            createGroup: vi.fn(),
            deleteGroup: vi.fn(),
            fetchGroup: vi.fn(),
            updateGroup: vi.fn(),
            error: "",
            loading: false
        });

        vi.mocked(getAssetUrl).mockImplementation(
            path => path ?? ""
        );
    });

    it("fetches suggestions and groups on mount", () => {
        render(<Suggestions />);

        expect(fetchSuggestedUsers)
            .toHaveBeenCalledTimes(1);

        expect(fetchGroups)
            .toHaveBeenCalledTimes(1);
    });

    it("renders suggested users", () => {
        render(<Suggestions />);

        expect(
            screen.getByText("@john")
        ).toBeInTheDocument();

        expect(
            screen.getByText("@alice")
        ).toBeInTheDocument();
    });

    it("renders groups", () => {
        render(<Suggestions />);

        expect(screen.getByText("React Fans")).toBeInTheDocument();
        expect(screen.getByText("1.2k members")).toBeInTheDocument();
    });

    it("renders user avatars", () => {
        render(<Suggestions />);

        const avatars = screen.getAllByAltText("avatar");

        expect(avatars).toHaveLength(2);
        expect(avatars[0]).toHaveAttribute("src", "john.png");
        expect(avatars[1]).toHaveAttribute("src", "alice.png");
    });

    it("renders group logos", () => {
        render(<Suggestions />);

        const logos = screen.getAllByAltText("group logo");

        expect(logos).toHaveLength(1);
        expect(logos[0]).toHaveAttribute("src", "react.png");
    });
});