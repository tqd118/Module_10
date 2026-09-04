"use client";

import s from "./Header.module.scss";
import { useState } from "react";
import Link from "next/link";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Header() {
    const { t } = useTranslation();
    const user = useAppSelector((state) => state.auth.user);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={s.header}>
            <Link href="/" className={s.logo}>
                <i className="icon-sidekick-logo" />
                sidekick
            </Link>

            {user ? (
                <Link className={s.user} href="/profile/info">
                    <Image 
                        src={getAssetUrl(user.profileImage)} 
                        alt="avatar" 
                        width={24}
                        height={24}
                        className={s.image}/>
                    {user.firstName + " " + user.secondName}
                </Link>
            ) : (
                <div className={s.links}>
                    <Link href="/register">{t("header.signUp")}</Link>
                    <Link href="/login">{t("header.signIn")}</Link>
                </div>
            )}

            <button className={s.burgerMenu} onClick={() => setMenuOpen(true)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {menuOpen && (
                <div className={s.menuOverlay} onClick={() => setMenuOpen(false)}>
                    <div className={s.menu} onClick={(e) => e.stopPropagation()}>
                        <div className={`${s.header} ${s.menuHeader}`}>
                            <Link href="/" className={s.logo}>
                                <i className="icon-sidekick-logo" />
                                sidekick
                            </Link>
                            {user && (
                                <Link className={s.user} href="/profile/info">
                                    <Image 
                                        src={getAssetUrl(user.profileImage)} 
                                        alt="avatar"
                                        width={24}
                                        height={24} 
                                    />
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <>
                                <Link href="/profile/info" className={s.menuButton}>
                                    {t("profile.profileInfo")}
                                </Link>
                                <Link href="/profile/stats" className={s.menuButton}>
                                    {t("profile.stats")}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/register" className={s.menuButton}>
                                    {t("header.signUp")}
                                </Link>
                                <Link href="/login" className={s.menuButton}>
                                    {t("header.signIn")}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}