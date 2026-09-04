import s from "./PostForm.module.scss";

export default function PostFormSkeleton() {
    return (
        <div className={s.form}>
            <div className={s.heading}>
                <div className="skeleton-line" style={{ width: "60%", height: 50 }} />
            </div>
            <div className="skeleton-line" style={{ width: "65%", height: 55 }} />
            <div className="skeleton-line" style={{ width: "100%", height: 55 }} />
            <div className="skeleton-line" style={{ width: "100%", height: 110 }} />
            <div className="skeleton-line" style={{ width: 120, height: 40, marginLeft: "auto" }} />
        </div>
    );
}