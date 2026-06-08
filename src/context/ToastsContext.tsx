import { createContext, useContext, useState, type ReactNode } from "react";

interface Toast {
	id: string;
	message: string;
    type: ToastType;
};

type ToastType = "success" | "error" | "warn";

type ToastContextType = {
	showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = (id: string) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	};

	const showToast = (message: string, type: ToastType) => {
		const id = crypto.randomUUID();

		setToasts(prev => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts(prev => prev.filter(t => t.id !== id));
		}, 5000);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}

			<div className="toastContainer">
				{toasts.map(toast => (
					<div key={toast.id} className={"toast " + toast.type}>
						<p>{toast.message}</p>
                        <div onClick={() => removeToast(toast.id)}>✕</div>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used inside ToastProvider");
	}

	return context;
}