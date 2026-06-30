"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function ProfileGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAppSelector(state => state.auth.user);
    const ready = useAppSelector(state => state.auth.ready);

    if (ready) {
        if (!user) {
            redirect("/login");
        }

        return children;
    }
}