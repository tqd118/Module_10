import s from "./MainLayout.module.scss"
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout() {
    return (
        <div className={s.layout}>
            <Header />
            <main className={s.content}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
