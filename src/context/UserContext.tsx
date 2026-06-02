import type { User } from "@/types/social";
import { createContext, useContext, useState, useEffect, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface UserContextType {
    userId: number | null;
    setUserId: Dispatch<SetStateAction<number | null>>;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({children}: {children: ReactNode}) {
    const [userId, setUserId] = useState<number | null>(() => {
        const id = localStorage.getItem("userId");
        return id ? +id : null;
    });
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (userId && user) {
            localStorage.setItem("userId", userId.toString());
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            const localUserId = localStorage.getItem("userId");
            const localUser = localStorage.getItem("user");
            setUserId(localUserId ? +localUserId : null);
            setUser(localUser ? JSON.parse(localUser) : null);
        }
    }, [userId, user]);

    return (
        <UserContext.Provider 
            value={{
                userId, 
                setUserId,
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }

    return context;
}