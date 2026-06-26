import type { CSSProperties } from "react";
import s from "./Spinner.module.scss";

export default function Spinner({style}: {style?: CSSProperties}) {
    return <div className={s.spinner} style={style}/>;
}