import { Component, type ReactNode } from "react";
import s from "./Button.module.scss"

interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export default class Button extends Component<ButtonProps> {
    render(): ReactNode {
        return (
            <button 
                className={`${s.button} ${this.props.className ? ` ${this.props.className}` : ""}`} 
                onClick={() => {
                    if (this.props.onClick) {
                        this.props.onClick();
                    }
                }}
            >
                {this.props.text}
            </button>
        )
    }
}