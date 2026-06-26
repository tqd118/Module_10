"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastsContext";
import { useEffect, useState, type ReactNode } from "react";
import { REPO_NAME } from "@/config/basePath";
import "@/i18n";

function patchServiceWorkerScope() {
    if (typeof window === "undefined" || !navigator.serviceWorker?.register) {
        return;
    }

    const originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);

    navigator.serviceWorker.register = (scriptURL, options) =>
        originalRegister(scriptURL, { ...options, scope: "/" });
}

export function Providers({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        patchServiceWorkerScope();

        import("@sidekick-monorepo/internship-backend")
            .then(({ startMockingSocial }) => startMockingSocial(REPO_NAME))
            .catch(console.error)
            .finally(() => setReady(true));
    }, []);

    if (!ready) return null;

    return (
        <Provider store={store}>
            <ThemeProvider>
                <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
        </Provider>
    );
}