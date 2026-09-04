"use client"

import StatsCard from "@/components/ui/StatsCard";
import s from "./ProfileStats.module.scss"
import StatsMetrics from "@/components/ui/StatsMetrics";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import useMonthsStats from "@/hooks/useMonthsStats";
import { useTranslation } from "react-i18next";

export default function ProfileStats() {
    const { t } = useTranslation();
    const [chartView, setChartView] = useState(false)

    const { 
        fetchUserLikes, 
        fetchUserComments, 
        fetchUserPosts,
        likes,
        comments,
        posts
    } = useProfile();

    const getLastMonthsStats = useMonthsStats();

    useEffect(() => {
        fetchUserLikes();
        fetchUserComments();
        fetchUserPosts();
    }, []);

    return (
        <div className={s.page}>
            <StatsCard count={likes.length} title={t("stats.likesTitle")}/>
            <StatsCard count={comments.length} title={t("stats.commentsTitle")}/>
            <StatsCard count={posts.length} title={t("stats.postsTitle")}/>

            <label className={s.preferencesSwitch}>
                <input type="checkbox" checked={chartView} onChange={() => setChartView(prev => !prev)} hidden />
                <span className={s.slider} />
                <span className={s.switchTitle}>{t("stats.chartView")}</span>
            </label>

            <StatsMetrics 
                data={getLastMonthsStats(likes)} 
                state={chartView ? "lineChart" : "table"}
                title={t("stats.likesTitle")}
                columnTitle={t("stats.likesColumnTitle")}
            />

            <StatsMetrics 
                data={getLastMonthsStats(comments)} 
                state={chartView ? "barChart" : "table"}
                title={t("stats.commentsTitle")}
                columnTitle={t("stats.commentsColumnTitle")}
            />
        </div>
    );
}
