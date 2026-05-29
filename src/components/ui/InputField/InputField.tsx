import { Component, type ReactNode } from "react";
import s from "./InputField.module.scss";

interface InputFieldProps {
    type: "email" | "password";
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    success?: boolean;
    hint?: string;
    disabled?: boolean;
}

export default class InputField extends Component<InputFieldProps> {
    render(): ReactNode {
        const {
            type,
            label,
            placeholder,
            value,
            onChange,
            error,
            success,
            hint,
            disabled
        } = this.props;

        let inputClassName = s.input;
        let iconClassName = s.icon;

        if (error) {
            inputClassName += ` ${s.error}`;
            iconClassName += ` icon-cross ${s.iconError}`;
        }

        if (success) {
            iconClassName += ` icon-mark ${s.iconSuccess}`;
        }

        return (
            <div className={`${s.field} ${disabled ? s.disabled : ""}`}>
                <label htmlFor={label}>
                    <i className={type === "email" ? "icon-mail" : "icon-eye"} /> {label}
                    <i className={iconClassName} />
                </label>

                <input
                    id={label}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                    className={inputClassName}
                />

                {hint && !error && <span className={s.hint}>{hint}</span>}
                {error && <span className={s.errorText}>{error}</span>}
            </div>
        );
    }
}