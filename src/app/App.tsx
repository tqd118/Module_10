import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { SocialProvider } from "@/context/SocialContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastsContext";

export default function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <SocialProvider>
                    <ToastProvider>
                        <RouterProvider router={router} />
                    </ToastProvider>
                </SocialProvider>
            </UserProvider>
        </ThemeProvider>
    );
}