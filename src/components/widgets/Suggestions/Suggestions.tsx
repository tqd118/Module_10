"use client"

import s from "./Suggestions.module.scss"
import { formatNumber } from "@/utils/formatNumber";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { useProfile } from "@/hooks/useProfile";
import { useGroups } from "@/hooks/useGroups";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Suggestions() {
    const { t } = useTranslation()
    const { suggestedUsers, fetchSuggestedUsers } = useProfile();
    const { groups, fetchGroups } = useGroups()

    useEffect(() => {
        fetchSuggestedUsers();
        fetchGroups();
    }, [])


    return (
        <div className={s.suggestions}>
            <div className={s.field}>
                <h3>{t("feed.peopleSuggestions")}</h3>
                {suggestedUsers.map(user => (
                    <div className={s.user} key={user.id}>
                        <Image 
                            src={getAssetUrl((
                                user as { photo?: string }).photo) || 
                                getAssetUrl("/assets/blank-user.png"
                                )} 
                            alt="avatar" 
                            className={s.icon}
                            height={48}
                            width={48}
                        />
                        <div className={s.userFullName}>{"John Doe"}</div>
                        <div className={s.username}>{"@" + user.username}</div>
                    </div>
                ))}
            </div>

            <div className={s.field}>
                <h3>{t("feed.groupSuggestions")}</h3>
                {groups.map(group => {
                    const {count, unit} = formatNumber(group.membersCount);

                    return (
                        <div className={s.group} key={group.id}>
                            <Image 
                                src={getAssetUrl(group.photo)} 
                                alt="group logo" 
                                className={s.icon}
                                height={48}
                                width={48}
                            />
                            <div className={s.name}>{group.title}</div>
                            <div className={s.members}>{t("members.member", {count, unit})}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
