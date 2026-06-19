import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useProfile } from "./useProfile";

export function useInitAuth() {
    const { setUserId, setUser } = useUser();
    const { fetchMe } = useProfile();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const verify = async () => {
            if (!localStorage.getItem("token")) {
                setReady(true);
                return;
            }

            try {
                const user = await fetchMe();
                setUserId(user.id);
                setUser(user);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("user")
                setUserId(null);
                setUser(null);
            } finally {
                setReady(true);
            }
        };

        verify();
    }, []);

    return { ready };
}