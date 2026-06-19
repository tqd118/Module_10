import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentForm from "@/components/ui/CommentForm";

vi.mock("@/context/UserContext", () => ({
    useUser: vi.fn(),
}));

import { useUser } from "@/context/UserContext";
import type { User } from "@/types/social";

const mockUser: User = { id: 1, username: "testuser" };

describe("CommentForm", () => {
    beforeEach(() => {
        vi.mocked(useUser).mockReturnValue({
            userId: mockUser.id,
            setUserId: vi.fn(),
            user: mockUser,
            setUser: vi.fn(),
        });
    });

    it("renders textarea and submit button", () => {
        render(<CommentForm postId={1} onCreateComment={vi.fn()} />);
        expect(
            screen.getByPlaceholderText("Write description here..."),
        ).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("updates textarea value on input", async () => {
        render(<CommentForm postId={1} onCreateComment={vi.fn()} />);
        const textarea = screen.getByPlaceholderText(
            "Write description here...",
        );
        await userEvent.type(textarea, "Hello world");
        expect(textarea).toHaveValue("Hello world");
    });

    it("calls onCreateComment with postId and text on submit", async () => {
        const onCreateComment = vi.fn();
        render(<CommentForm postId={42} onCreateComment={onCreateComment} />);

        await userEvent.type(
            screen.getByPlaceholderText("Write description here..."),
            "My comment",
        );
        await userEvent.click(screen.getByRole("button"));

        expect(onCreateComment).toHaveBeenCalledWith(42, "My comment");
    });

    it("clears textarea after successful submit", async () => {
        render(<CommentForm postId={1} onCreateComment={vi.fn()} />);
        const textarea = screen.getByPlaceholderText(
            "Write description here...",
        );
        await userEvent.type(textarea, "My comment");
        await userEvent.click(screen.getByRole("button"));
        expect(textarea).toHaveValue("");
    });

    it("does not call onCreateComment when text is empty", async () => {
        const onCreateComment = vi.fn();
        render(<CommentForm postId={1} onCreateComment={onCreateComment} />);
        await userEvent.click(screen.getByRole("button"));
        expect(onCreateComment).not.toHaveBeenCalled();
    });

    it("does not call onCreateComment when user is not authenticated", async () => {
        vi.mocked(useUser).mockReturnValue({
            userId: null,
            setUserId: vi.fn(),
            user: null,
            setUser: vi.fn(),
        });

        const onCreateComment = vi.fn();
        render(<CommentForm postId={1} onCreateComment={onCreateComment} />);

        await userEvent.type(
            screen.getByPlaceholderText("Write description here..."),
            "My comment",
        );
        await userEvent.click(screen.getByRole("button"));

        expect(onCreateComment).not.toHaveBeenCalled();
    });
});
