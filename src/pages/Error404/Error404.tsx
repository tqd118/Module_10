import s from "./Error404.module.scss"

export default function Error404() {
    return (
        <div className={s.page}>
            <i className="icon-error-404"/>
            <h2 className={s.title}>Page not found</h2>
        </div>
    )
}
