import { useTranslation } from "react-i18next";

type MonthStats = {
    month: string;
    count: number;
};

export default function useMonthsStats() {
    const { t } = useTranslation();
    const months = t("months", { returnObjects: true }) as string[];

    return function getLastMonthsStats(data: { creationDate: string }[]): MonthStats[] {
        if (data.length === 0) {
            return []
        }
        const counts = new Map<string, number>();

        let lastDate = new Date(data[0].creationDate);

        for (const item of data) {
            const date = new Date(item.creationDate);

            if (date > lastDate) {
                lastDate = date;
            }

            const key = `${date.getFullYear()}-${date.getMonth()}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const result: MonthStats[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(lastDate);
            date.setMonth(date.getMonth() - i);

            const key = `${date.getFullYear()}-${date.getMonth()}`;

            result.push({
                month: months[date.getMonth()],
                count: counts.get(key) ?? 0,
            });
        }

        return result;
    }
}