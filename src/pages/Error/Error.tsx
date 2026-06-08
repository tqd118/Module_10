import s from "./Error.module.scss"

export default function Error() {
    return (
        <div className={s.page}>
            <i className="icon-error"/>
            <h2 className={s.title}>Oops...<br/>Something bad has just happened</h2>
        </div>
    )
}
