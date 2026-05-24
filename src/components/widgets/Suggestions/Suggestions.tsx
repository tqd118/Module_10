import { useSocial } from "@/context/SocialContext";
import s from "./Suggestions.module.scss"
import { formatNumber } from "@/utils/formatNumber";
import { getAssetUrl } from '@/utils/getAssetUrl';

export default function Suggestions() {
    const {state} = useSocial();

    return (
        <div className={s.suggestions}>
            <div className={s.field}>
                <h3>Suggested people</h3>
                {state.users.slice(0, 5).map(user => (
                    <div className={s.user} key={user.id}>
                        <img src={getAssetUrl(user.userIcon)} alt="avatar" className={s.icon}/>
                        <div className={s.userFullName}>{user.userFullName}</div>
                        <div className={s.username}>{user.username}</div>
                    </div>
                ))}
            </div>

            <div className={s.field}>
                <h3>Communities you might like</h3>
                {state.groups.slice(0, 3).map(group => (
                    <div className={s.group} key={group.id}>
                        <img src={getAssetUrl(group.groupIcon)} alt="group logo" className={s.icon}/>
                        <div className={s.name}>{group.name}</div>
                        <div className={s.members}>{ formatNumber(group.memberCount) } members</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
