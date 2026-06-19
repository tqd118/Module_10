import s from "./Suggestions.module.scss"
import { formatNumber } from "@/utils/formatNumber";
import { getAssetUrl } from '@/utils/getAssetUrl';
import { useProfile } from "@/hooks/useProfile";
import { useGroups } from "@/hooks/useGroups";
import { useEffect } from "react";

export default function Suggestions() {
    const { loading, suggestedUsers, fetchSuggestedUsers } = useProfile();
    const { groups, fetchGroups } = useGroups()

    useEffect(() => {
        fetchSuggestedUsers();
        fetchGroups();
    }, [])

    return (
        <div className={s.suggestions}>
            <div className={s.field}>
                <h3>Suggested people</h3>
                {suggestedUsers.map(user => (
                    <div className={s.user} key={user.id}>
                        <img 
                            src={getAssetUrl(user.photo) || "/Module_10/assets/blank-user.png"} 
                            alt="avatar" 
                            className={s.icon}
                        />
                        <div className={s.userFullName}>{"John Doe"}</div>
                        <div className={s.username}>{"@" + user.username}</div>
                    </div>
                ))}
            </div>

            <div className={s.field}>
                <h3>Communities you might like</h3>
                {groups.map(group => (
                    <div className={s.group} key={group.id}>
                        <img src={getAssetUrl(group.photo)} alt="group logo" className={s.icon}/>
                        <div className={s.name}>{group.title}</div>
                        <div className={s.members}>{ formatNumber(group.membersCount) } members</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
