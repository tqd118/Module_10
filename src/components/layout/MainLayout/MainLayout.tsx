import { Outlet, useLocation } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import s from "./MainLayout.module.scss";
import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout() {
    const location = useLocation();

    const animation = useSpring({
        from: { opacity: 0, transform: "translateY(12px)" },
        to:   { opacity: 1, transform: "translateY(0px)" },
        reset: true,
        config: { tension: 300, friction: 28 },
    });

    return (
        <div className={s.layout}>
            <Header />
                <main className={s.content}>
                    <animated.div key={location.pathname} style={animation}>
                        <Outlet />
                    </animated.div>
                </main>
            <Footer />
        </div>
    );
}