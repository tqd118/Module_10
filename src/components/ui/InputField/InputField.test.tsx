import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from "@/components/ui/InputField";

describe("InputField", () => {
    const defaultProps = {
        type: "email" as const,
        label: "Email",
        placeholder: "Enter your email",
        value: "",
        onChange: vi.fn(),
    };

    it("renders label text", () => {
        render(<InputField {...defaultProps} />);
        expect(screen.getByText("Email", { selector: "label" })).toBeInTheDocument();
    });

    it("renders input with correct type", () => {
        render(<InputField {...defaultProps} />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("type", "email");
    });

    it("renders input with correct placeholder", () => {
        render(<InputField {...defaultProps} />);
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });

    it("calls onChange with the new value on input", async () => {
        const onChange = vi.fn();
        render(<InputField {...defaultProps} onChange={onChange} />);

        await userEvent.type(screen.getByRole("textbox"), "a");

        expect(onChange).toHaveBeenCalledWith("a");
    });

    it("renders error message when error prop is provided", () => {
        render(<InputField {...defaultProps} error="Invalid email" />);
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("does not render error message when error is not provided", () => {
        render(<InputField {...defaultProps} />);
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
    });

    it("renders hint when provided and no error", () => {
        render(<InputField {...defaultProps} hint="Use a valid email address" />);
        expect(screen.getByText("Use a valid email address")).toBeInTheDocument();
    });

    it("hides hint when error is present", () => {
        render(
            <InputField {...defaultProps} hint="Use a valid email address" error="Invalid email" />
        );
        expect(screen.queryByText("Use a valid email address")).not.toBeInTheDocument();
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("disables input when disabled prop is true", () => {
        render(<InputField {...defaultProps} disabled={true} />);
        expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("renders password input for type password", () => {
        render(<InputField {...defaultProps} type="password" label="Password" />);
        const input = document.getElementById("Password");
        expect(input).toHaveAttribute("type", "password");
    });
});
