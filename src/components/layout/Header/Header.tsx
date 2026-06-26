import s from "./Header.module.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";

export default function Header() {
    const { t } = useTranslation();
    const user = useAppSelector((state) => state.auth.user);

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={s.header}>
            <Link to="/" className={s.logo}>
                <i className="icon-sidekick-logo" />
                sidekick
            </Link>

            {user ? (
                <Link className={s.user} to={`/profile/info/`}>
                    <img src={getAssetUrl(user.profileImage)} alt="avatar" />
                    {user.firstName + " " + user.secondName}
                </Link>
            ) : (
                <div className={s.links}>
                    <Link to="/register">{t("header.signUp")}</Link>
                    <Link to="/login">{t("header.signIn")}</Link>
                </div>
            )}

            <button className={s.burgerMenu} onClick={() => setMenuOpen(true)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {menuOpen && (
                <div
                    className={s.menuOverlay}
                    onClick={() => setMenuOpen(false)}
                >
                    <div
                        className={s.menu}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`${s.header} ${s.menuHeader}`}>
                            <Link to="/" className={s.logo}>
                                <i className="icon-sidekick-logo" />
                                sidekick
                            </Link>

                            {user && (
                                <Link className={s.user} to={`/profile/info/`}>
                                    <img
                                        src={getAssetUrl(user.profileImage)}
                                        alt="avatar"
                                    />
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <>
                                <Link
                                    to={`/profile/info/`}
                                    className={s.menuButton}
                                >
                                    Profile info
                                </Link>
                                <Link
                                    to={`/profile/stats/`}
                                    className={s.menuButton}
                                >
                                    Statistics
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className={s.menuButton}>
                                    {t("header.signUp")}
                                </Link>
                                <Link to="/login" className={s.menuButton}>
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
