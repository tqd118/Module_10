import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "@/components/ui/Modal";

describe("Modal", () => {
    it("renders children when isOpen is true", () => {
        render(
            <Modal isOpen={true} onClose={vi.fn()}>
                <p>Modal content</p>
            </Modal>,
        );

        expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("renders nothing when isOpen is false", () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()}>
                <p>Modal content</p>
            </Modal>,
        );

        expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });

    it("calls onClose when overlay is clicked", async () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Modal content</p>
            </Modal>,
        );

        const overlay =
            screen.getByText("Modal content").parentElement!.parentElement!;
        await userEvent.click(overlay);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when modal content is clicked", async () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Modal content</p>
            </Modal>,
        );

        await userEvent.click(screen.getByText("Modal content"));

        expect(onClose).not.toHaveBeenCalled();
    });
});
