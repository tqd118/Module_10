"use client";

import s from "./Profile.module.scss";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useEffect } from "react";
import ProfileInfoSkeleton from "./ProfileInfoSkeleton";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";

const ProfileInfo = lazy(() => import("./ProfileInfo"));

interface ProfilePageProps {
    page: "info" | "stats";
}

export default function ProfilePage({ page }: ProfilePageProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const userId = useAppSelector((state) => state.auth.userId);

    useEffect(() => {
        if (!userId) {
            router.replace("/login");
        }
    }, [router, userId]);

    if (!userId) {
        return null;
    }

    const switchPage = () => {
        router.push(page === "info" ? "/profile/stats" : "/profile/info");
    };

    return (
        <div className={s.page}>
            <label className={s.switch}>
                <input
                    type="checkbox"
                    id="pageVariant"
                    hidden
                    checked={page === "stats"}
                    onChange={switchPage}
                />
                <span className={`${s.switchElement} ${page === "info" ? s.switchActive : ""}`}>
                    {t("profile.profileInfo")}
                </span>
                <span className={`${s.switchElement} ${page === "stats" ? s.switchActive : ""}`}>
                    {t("profile.stats")}
                </span>
            </label>

            <Suspense fallback={<ProfileInfoSkeleton />}>
                {page === "info" ? <ProfileInfo /> : null}
            </Suspense>
        </div>
    );
}
