import type { User } from "@/types/social";
import { createContext, useContext, useState, useEffect, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface UserContextType {
    userId: User["id"] | null;
    setUserId: Dispatch<SetStateAction<User["id"] | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({children}: {children: ReactNode}) {
    const [userId, setUserId] = useState<User["id"] | null>(() => {
        return localStorage.getItem("userId") as User["id"] | null;
    });

    useEffect(() => {
        if (userId) {
            localStorage.setItem("userId", userId);
        } else {
            localStorage.removeItem("userId");
        }

    }, [userId]);

    return (
        <UserContext.Provider value={{userId, setUserId}}>
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