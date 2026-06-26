import s from "./Profile.module.scss"

export default function ProfileInfoSkeleton() {
    return (
        <div className={s.info}>
            <div className={s.profile}>
                <div className="skeleton-line" style={{ width: 140, height: 28 }} />

                <div className={s.user}>
                    <div className="skeleton-circle" style={{ width: 80, height: 80 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div className="skeleton-line" style={{ width: 140, height: 20 }} />
                        <div className="skeleton-line" style={{ width: 100, height: 16 }} /> 
                    </div>
                </div>

                {[...Array(4)].map((_, i) => (
                    <div key={i} className={s.inputLabel}>
                        <div className="skeleton-line" style={{ width: 80, height: 14 }} />
                        <div className="skeleton-line" style={{ width: "100%", height: 40 }} />
                    </div>
                ))}

                <div className="skeleton-line" style={{ width: 180, height: 40 }} />
            </div>

            <div className={s.preferences}>
                <div className="skeleton-line" style={{ width: 140, height: 28 }} />
                <div className="skeleton-line" style={{ width: 130, height: 20 }} />
                <div className="skeleton-line" style={{ width: 100, height: 28 }} />
                <div className="skeleton-line" style={{ width: 120, height: 28 }} />
            </div>
        </div>
    );
}