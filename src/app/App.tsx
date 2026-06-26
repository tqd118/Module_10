import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastsContext";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initAuth } from "@/store/authSlice";
import { useEffect } from "react";

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </ThemeProvider>
    );
}

function AppContent() {
    const dispatch = useAppDispatch();
    const ready = useAppSelector(state => state.auth.ready);

    useEffect(() => {
        dispatch(initAuth());
    });

    if (!ready) return null;

    return <RouterProvider router={router} />;
}
