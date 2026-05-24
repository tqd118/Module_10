import { createContext, useContext, useReducer, useEffect, type Dispatch, type ReactNode } from "react"
import postsData from "@/data/posts.json"
import usersData from "@/data/users.json"
import commentsData from "@/data/comments.json"
import groupsData from "@/data/groups.json"
import { socialReducer } from "@/reducer/socialReducer"
import type { SocialState } from "@/reducer/social.types"
import type { SocialAction } from "@/reducer/socialActions"
import type { Comment, Post, User, Group } from "@/types/social"


interface SocialContextType {
    state: SocialState;
    dispatch: Dispatch<SocialAction>;
}

const SocialContext = createContext<SocialContextType | null>(null);

const initialState: SocialState = {
    posts: postsData as Post[],
    users: usersData as User[],
    comments: commentsData as Comment[],
    groups: groupsData as Group[],
}

function loadState(): SocialState {
    const saved = localStorage.getItem("socialState");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return initialState;
        }
    }
    return initialState;
}

export function SocialProvider({children}: {children: ReactNode}) {
    const [state, dispatch] = useReducer(socialReducer, undefined, loadState);

    useEffect(() => {
        localStorage.setItem("socialState", JSON.stringify(state));
    }, [state]);

    return (
        <SocialContext.Provider value={{state, dispatch}}>
            {children}
        </SocialContext.Provider>
    )
}

export function useSocial() {
    const context = useContext(SocialContext);

    if (!context) {
        throw new Error("useSocial must be used within SocialProvider");
    }

    return context;
}