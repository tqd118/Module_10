import { useUser } from "@/context/UserContext";
import s from "./Header.module.scss"
import { useSocial } from "@/context/SocialContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAssetUrl } from '@/utils/getAssetUrl';

export default function Header() {
    const { userId } = useUser();
    const { state } = useSocial();

    const [menuOpen, setMenuOpen] = useState(false)
    const user = state.users.find(user => user.id === userId);

    return (
        <header className={s.header}>
            <Link to="/" className={s.logo}>
                <i className="icon-sidekick-logo"/>
                sidekick
            </Link>

            {user ? (
                <Link className={s.user} to={`/profile/info/${user.id}`}>
                    <img src={getAssetUrl(user.userIcon)} alt="avatar" />
                    {user.userFullName}
                </Link>
            ) : (
                <div className={s.links}>
                    <Link to="/register">Sign Up</Link>
                    <Link to="/login">Sign In</Link>
                </div>
            )}

            <button className={s.burgerMenu} onClick={() => setMenuOpen(true)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {menuOpen && (
                <div className={s.menuOverlay} onClick={() => setMenuOpen(false)}>
                    <div className={s.menu} onClick={e => e.stopPropagation()}>
                        <div className={`${s.header} ${s.menuHeader}`}>
                            <Link to="/" className={s.logo}>
                                <i className="icon-sidekick-logo"/>
                                sidekick
                            </Link>

                            {user && (
                                <Link className={s.user} to={`/profile/info/${user.id}`}>
                                    <img src={getAssetUrl(user.userIcon)} alt="avatar" />
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <>
                                <Link to={`/profile/info/${userId}`} className={s.menuButton}>Profile info</Link>
                                <Link to={`/profile/stats/${userId}`} className={s.menuButton}>Statistics</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className={s.menuButton}>Sign Up</Link>
                                <Link to="/login" className={s.menuButton}>Sign In</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
