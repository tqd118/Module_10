import { Component, type ReactNode, type ButtonHTMLAttributes } from "react";
import s from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default class Button extends Component<ButtonProps> {
    render(): ReactNode {
        const { children, className = "", ...buttonProps } = this.props;

        return (
            <button
                className={`${s.button} ${className}`}
                {...buttonProps}
            >
                {children}
            </button>
        );
    }
}