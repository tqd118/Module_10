import s from "./Profile.module.scss"
import { useNavigate, useParams } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import type { User } from "@/types/social";


export default function Profile() {
    const { userId, page } = useParams<{userId: User["id"], page: "info" | "stats"}>();
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
