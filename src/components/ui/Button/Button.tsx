import s from "./Button.module.scss"

interface ButtonProps {
    text: string;
    handler: () => void;
    className?: string;
}

export default function Button({text, handler, className}: ButtonProps) {
    return (
        <button 
            className={`${s.button} ${className ? ` ${className}` : ""}`} 
            onClick={e => {
                e.preventDefault();
                handler()
            }}
        >
            {text}
        </button>
    );
}
