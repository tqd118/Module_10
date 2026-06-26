import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./Modal.module.scss";

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const FOCUSABLE_SELECTORS = [
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
].join(",");

export default function Modal({
    children,
    onClose,
    isOpen,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTORS
        );

        focusableElements?.[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key !== "Tab" || !focusableElements?.length) {
                return;
            }

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={s.overlay} onClick={onClose}>
            <div
                ref={modalRef}
                className={s.modal}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}