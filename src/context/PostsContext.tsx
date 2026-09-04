"use client"

import { createContext, useContext, type ReactNode } from "react";
import { usePosts } from "@/hooks/usePosts";

type PostsContextType = ReturnType<typeof usePosts>;

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
    return (
        <PostsContext.Provider value={usePosts()}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePostsContext() {
    const ctx = useContext(PostsContext);
    if (!ctx) {
        throw new Error("usePostsContext must be used inside PostsProvider");
    }
    return ctx;
}