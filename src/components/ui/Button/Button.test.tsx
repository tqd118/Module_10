import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/ui/Button";

describe("Button", () => {
    it("renders button text", () => {
        render(<Button>Sign In</Button>);

        expect(
            screen.getByRole("button", { name: "Sign In" })
        ).toBeInTheDocument();
    });

    it("calls click handler when clicked", async () => {
        const handleClick = vi.fn();

        render(
            <Button onClick={handleClick}>
                Sign In
            </Button>
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Sign In" })
        );

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies custom class name", () => {
        render(
            <Button className="custom">
                Sign In
            </Button>
        );

        expect(
            screen.getByRole("button", { name: "Sign In" })
        ).toHaveClass("custom");
    });
});