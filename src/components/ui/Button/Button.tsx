import { Component, type ReactNode, type ButtonHTMLAttributes } from "react";

const buttonStyle = {
    backgroundColor: "var(--color-brand-primary)",
    color: "white",
    height: "44px",
    border: "none",
    transition: ".3s all",
    width: "100%",
    cursor: "pointer",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

interface ButtonState {
    isHovered: boolean;
    isActive: boolean;
}

export default class Button extends Component<ButtonProps, ButtonState> {
    state: ButtonState = { isHovered: false, isActive: false };

    getStyle() {
        const { disabled } = this.props;
        const { isHovered, isActive } = this.state;

        if (disabled) {
            return {
                ...buttonStyle,
                backgroundColor: "var(--color-surface-subtle)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                cursor: "not-allowed",
            };
        }

        if (isActive) {
            return { ...buttonStyle, backgroundColor: "var(--color-brand-secondary)" };
        }

        if (isHovered) {
            return { ...buttonStyle, backgroundColor: "var(--color-feedback-positive)" };
        }

        return buttonStyle;
    }

    render(): ReactNode {
        const { children, style, ...buttonProps } = this.props;

        return (
            <button
                style={{ ...this.getStyle(), ...style }}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false, isActive: false })}
                onMouseDown={() => this.setState({ isActive: true })}
                onMouseUp={() => this.setState({ isActive: false })}
                {...buttonProps}
            >
                {children}
            </button>
        );
    }
}