import s from "./Profile.module.scss"
import { useNavigate, useParams } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";


export default function Profile() {
    const { page } = useParams<{page: "info" | "stats"}>();
    const navigate = useNavigate();

    const switchPage = () => {
        if (page === "info") {
            navigate(`/profile/stats/`);
        } else {
            navigate(`/profile/info/`);
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
