import s from "./StatsCard.module.scss"

interface StatsCardProps {
    title: string;
    count: number;
}

export default function StatsCard({title, count}: StatsCardProps) {


    return (
        <div className={s.card}>
            <h4 className={s.title}>{title}</h4>
            <p className={s.counter}>{count}</p>
        </div>
    );
}
