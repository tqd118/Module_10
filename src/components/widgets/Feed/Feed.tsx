"use client"

import PostCard from "@/components/features/PostCard";
import s from "./Feed.module.scss"
import { useEffect } from "react";
import { usePostsContext } from "@/context/PostsContext";
import Spinner from "@/components/ui/Spinner";

export default function Feed() {
    const { posts, fetchPosts, toggleLike, loading, error } = usePostsContext();

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className={s.feed}>
            {!error && (
                loading ? <Spinner /> : (
                    posts.map(post => <PostCard post={post} onLike={toggleLike} key={post.id}/>)
                )
            )}
        </div>
    )
}
