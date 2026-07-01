import type { ReactNode } from "react";
import ProfileSwitch from "@/components/ui/ProfileSwitch";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "./AuthGuard"

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard >
            <MainLayout>
                <ProfileSwitch />
                {children}
            </MainLayout>
        </AuthGuard>
    );
}