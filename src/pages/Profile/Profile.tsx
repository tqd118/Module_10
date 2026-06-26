import s from "./Profile.module.scss"
import { useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProfileInfoSkeleton from "./ProfileInfoSkeleton";
import { useTranslation } from "react-i18next";

const ProfileInfo = lazy(() => import("./ProfileInfo"));


export default function Profile() {
    const { t } = useTranslation();
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
                <label className={s.switch} >
                    <input
                        type="checkbox" 
                        id="pageVariant" 
                        hidden
                        checked={page === "stats"}
                        onChange={switchPage}/>
                    <span className={`${s.switchElement} ${page === "info" && s.switchActive}`}>{t("profile.profileInfo")}</span>
                    <span className={`${s.switchElement} ${page === "stats" && s.switchActive}`}>{t("profile.stats")}</span>
                </label>

                <Suspense fallback={<ProfileInfoSkeleton />}>
                    {page === "info" ? <ProfileInfo /> : null}
                </Suspense>
        </div>
    );
}
