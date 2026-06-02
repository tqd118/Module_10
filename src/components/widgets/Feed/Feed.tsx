import PostCard from "@/components/features/PostCard";
import s from "./Feed.module.scss"
import { usePosts } from "@/hooks/usePosts";
import { useEffect } from "react";

export default function Feed() {
    const { posts, fetchPosts, toggleLike, loading, error } = usePosts();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    let content = null;

    if (!loading && !error) {
        content = posts.map(post => <PostCard post={post} onLike={toggleLike} key={post.id}/>)
    }

    return (
        <div className={s.feed}>
            {content}
        </div>
    )
}
