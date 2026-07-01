import { ReactElement } from "react";
import s from "./StatsMetrics.module.scss"
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface StatsMetricsProps {
    state: "table" | "lineChart" | "barChart";
    data: {
        month: string;
        count: number;
    }[];
    title: string;
    columnTitle: string;
}

export default function StatsMetrics({state, data, title, columnTitle}: StatsMetricsProps) {
    const { t } = useTranslation();
    let content: ReactElement | null = null;

    switch (state) {
        case "table": {
            content = (
                <table className={`${s.content} ${s.table}`}>
                    <thead>
                         <tr className={s.tableHeading}>
                            <th scope="col">{t("table.month")}</th>
                            <th scope="col">{t("table.counts", { columnTitle })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td>{row.month}</td>
                                <td>{row.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
        break;
        case "lineChart": {
            content = (
                <LineChart
                    style={{ 
                        width: "100%", 
                        height: "452px", 
                        padding: 10, 
                        paddingBottom: 0
                    }}
                    data={data.reverse()}
                    className={s.content}
                >
                    <CartesianGrid 
                        vertical={false}
                        stroke="var(--color-text-secondary)"
                        strokeWidth={1}
                    />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
                    <YAxis 
                        dataKey="count" 
                        width={20} 
                        stroke="var(--color-text-secondary)" 
                        niceTicks="auto" 
                        scale="linear" 
                        tickCount={10}
                        allowDecimals={false}
                    />

                    <Line
                        type="monotone"
                        stroke="var(--color-text-secondary)"
                        strokeWidth={4}
                        dot={{
                            fill: 'var(--color-text-primary)',
                        }}
                        dataKey="count"
                    />
                </LineChart>
            )
        }
        break;
        case "barChart": {
            content = (
                <BarChart
                    style={{ 
                        width: "100%", 
                        height: "452px", 
                        padding: 10, 
                        paddingBottom: 0
                    }}
                    data={data.reverse()}
                    className={s.content}
                >
                    <CartesianGrid 
                        vertical={false}
                        stroke="var(--color-text-secondary)"
                        strokeWidth={1}
                    />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
                    <YAxis 
                        dataKey="count" 
                        width={20} 
                        stroke="var(--color-text-secondary)" 
                        niceTicks="auto" 
                        scale="linear" 
                        tickCount={10}
                        allowDecimals={false}
                    />

                    <Bar dataKey="count" fill="var(--color-text-secondary)" />
                </BarChart>
            )
        }
    }

    return (
        <div className={s.card}>
            <h3 className={s.title}>{title}</h3>
            {content}
        </div>
    );
}
