import s from "./Button.module.scss"

interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export default function Button({text, onClick, className}: ButtonProps) {
    return (
        <button 
            className={`${s.button} ${className ? ` ${className}` : ""}`} 
            onClick={() => {
                if (onClick) {
                    onClick();
                }
            }}
        >
            {text}
        </button>
    );
}
