import type { ReactNode } from "react";
import s from "./Modal.module.scss"

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({children, onClose, isOpen}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
