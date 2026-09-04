import type { Metadata } from "next";
import { Providers } from "./providers";
import { AuthInitializer } from "./auth-initializer";
import "@/styles/normalize.css";
import "@/styles/icons.css";
import "@/styles/index.scss";

export const metadata: Metadata = {
    title: "Sidekick",
    description: "Social media network",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <AuthInitializer />
                    {children}
                </Providers>
            </body>
        </html>
    );
}