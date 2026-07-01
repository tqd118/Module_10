"use client";

import { animated, useSpring } from "@react-spring/web";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import s from "./MainLayout.module.scss";
import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const animation = useSpring({
        from: { opacity: 0, transform: "translateY(12px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        reset: true,
        config: { tension: 300, friction: 28 },
    });

    return (
        <div className={s.layout}>
            <Header />
            <main className={s.content}>
                <animated.div key={pathname} style={animation}>
                    {children}
                </animated.div>
            </main>
            <Footer />
        </div>
    );
}
