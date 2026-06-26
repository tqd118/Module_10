"use client"

import { Component, type ChangeEventHandler, type FocusEventHandler, type ReactNode} from "react";

interface InputFieldProps {
    type: "email" | "password";
    label: string;
    placeholder: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    error?: string;
    success?: boolean;
    hint?: string;
    name?: string;
    disabled?: boolean;
}

interface InputFieldState {
    isFocused: boolean;
}

const styles = {
    field: (disabled?: boolean) => ({
        display: "flex",
        flexDirection: "column" as const,
        gap: "6px",
        fontSize: "14px",
        width: "100%",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" as const : "auto" as const,
    }),

    label: () => ({
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "var(--color-text-primary)",
        fontWeight: 500,
        marginTop: "2px",
    }),

    icon: (variant?: "error" | "success") => ({
        marginLeft: "auto",
        fontSize: variant === "success" ? "14px" : "12px",
        color:
        variant === "error"
            ? "var(--color-error)"
            : variant === "success"
            ? "var(--color-brand-primary)"
            : undefined,
    }),

    input: (hasError?: boolean, isFocused?: boolean) => ({
        color: isFocused ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        border: `1px solid ${hasError ? "var(--color-error)" : isFocused ? "var(--color-brand-secondary)" : "var(--color-border)"}`,
        backgroundColor:
        hasError || isFocused ? "var(--color-surface)" : "var(--color-surface-subtle)",
        padding: "14px",
        transition: "all 0.2s ease",
        outline: "none",
        width: "100%",
        font: "inherit",
    }),

    hint: () => ({
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "var(--color-brand-primary)",
        fontSize: "13px",
        marginTop: "2px",
    }),

    errorText: () => ({
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "var(--color-error)",
        fontSize: "13px",
        marginTop: "2px",
    }),
};

export default class InputField extends Component<InputFieldProps, InputFieldState> {
    state: InputFieldState = { isFocused: false };

    render(): ReactNode {
        const { type, label, placeholder, value, onChange, onBlur, error, success, hint, disabled, name } = this.props;
        const { isFocused } = this.state;

        const iconVariant = error ? "error" : success ? "success" : undefined;
        const iconClasses = [
            "icon",
            error ? "icon-cross" : success ? "icon-mark" : "",
        ].filter(item => item !== "").join(" ");

        return (    
        <div style={styles.field(disabled)}>
            <label htmlFor={name} style={styles.label()}>
                <i className={type === "email" ? "icon-mail" : "icon-eye"} />
                    {label}
                <i className={iconClasses} style={styles.icon(iconVariant)} />
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={styles.input(Boolean(error), isFocused)}
                onFocus={() => this.setState({ isFocused: true })}
                onBlur={(e) => {
                    this.setState({ isFocused: false });
                    onBlur?.(e);
                }}
            />
            {hint && !error && (
                <span style={ styles.hint() }>
                    {hint}
                </span>
            )}

            {error && (
                <span style={ styles.errorText() }>
                    {error}
                </span>
            )}
        </div>
        );
    }
}