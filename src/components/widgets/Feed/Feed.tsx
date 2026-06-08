import PostCard from "@/components/features/PostCard";
import s from "./Feed.module.scss"
import { useEffect } from "react";
import { usePostsContext } from "@/context/PostsContext";

export default function Feed() {
    const { posts, fetchPosts, toggleLike, loading, error } = usePostsContext();

    useEffect(() => {
        fetchPosts();
    }, []);

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
