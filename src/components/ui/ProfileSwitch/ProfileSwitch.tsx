"use client"

import { useTranslation } from "react-i18next";
import s from "./ProfileSwitch.module.scss"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ProfileSwitch() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter()

    const switchPage = () => {
        router.push(pathname.includes("info") ? "/profile/stats" : "/profile/info");
    };

    return (
        <label className={s.switch}>
            <input
                type="checkbox"
                id="pageVariant"
                hidden
                checked={pathname === "profile/stats"}
                onChange={switchPage}
            />
            <span className={`${s.switchElement} ${pathname.includes("info") ? s.switchActive : ""}`}>
                {t("profile.profileInfo")}
            </span>
            <span className={`${s.switchElement} ${pathname.includes("stats") ? s.switchActive : ""}`}>
                {t("profile.stats")}
            </span>
        </label>
    );
}
