import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastsContext";

import { useInitAuth } from "@/hooks/useInitAuth"; 
import useTest from "@/hooks/useTest";

export default function App() {

    if(true) {
        useTest()
    }
    return (
        <ThemeProvider>
            <UserProvider>
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

function AppContent() {
    const { ready } = useInitAuth();

    if (!ready) return null;

    return <RouterProvider router={router}/>;
}