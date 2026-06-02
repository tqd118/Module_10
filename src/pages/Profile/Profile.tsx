import s from "./Profile.module.scss"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ProfileInfo from "./ProfileInfo";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/context/UserContext";


export default function Profile() {
    const { userId, page } = useParams<{userId: string, page: "info" | "stats"}>();
    const { fetchMe } = useProfile();
    const { user } = useUser();
    const navigate = useNavigate();

    if (userId === undefined) {
        throw new Error("User id not found");
    }

    const switchPage = () => {
        if (page === "info") {
            navigate(`/profile/stats/${userId}`);
        } else {
            navigate(`/profile/info/${userId}`);
        }
    }

    useEffect(() => {
        const checkAutorized = async () => {
            try {
                const authorizedUser = await fetchMe();
                if (authorizedUser.id !== +userId) {
                    navigate("/login", { replace: true });
                }
            } catch (e) {}
        }

        if (!user) {
            navigate("/login", { replace: true });
        }
        checkAutorized()
    }, [userId, user]);

    return (
        <div className={s.page}>
                <label className={s.switch}>
                    <input
                        type="checkbox" 
                        id="pageVariant" 
                        hidden
                        checked={page === "stats"}
                        onChange={switchPage}/>
                    <span className={`${s.switchElement} ${page === "info" && s.switchActive}`}>Profile Info</span>
                    <span className={`${s.switchElement} ${page === "stats" && s.switchActive}`}>Statistics</span>
                </label>

                {page === "info" ? <ProfileInfo /> : null}
        </div>
    );
}
