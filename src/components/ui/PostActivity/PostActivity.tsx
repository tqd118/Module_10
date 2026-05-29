import type { Post } from "@/types/social";
import s from "./PostActivity.module.scss"
import { useState } from "react";
import { useSocial } from "@/context/SocialContext";
import CommentForm from "../CommentForm";
import { useUser } from "@/context/UserContext";

interface PostActivityProps {
    post: Post;
}

export default function PostActivity({post}: PostActivityProps) {
    const { state, dispatch } = useSocial();
    const { userId } = useUser();

    const [expanded, setExpanded] = useState(false);

    let liked = false;

    const user = state.users.find(user => user.id === userId);
    if (user) {
        liked = (post.likes.includes(user.id));
    }

    const comments = new Set(post.comments);
    const postComments = state.comments.filter(comment =>
        comments.has(comment.id)
    );

    const handleLike = () => {
        if (user) {
            liked = !liked;
            dispatch({type: "TOGGLE_LIKE", payload: {postId: post.id, userId: user.id}})
        }
    }

    return (
        <>
            <div className={s.short}>
                <i className={`${s.likeIcon} ${liked ? "icon-like-filled" : "icon-like"}`} onClick={handleLike}/>
                <span>{post.likes.length} likes</span>

                <i className={`${s.commentsIcon} icon-comments`}/>
                {user ? (
                    <span>{post.comments.length} comments</span>
                ) : (
                    <span>You have to login to see the comments</span>
                )}

                {user && (
                    <label className={s.expander}>
                        <input 
                            type="checkbox" 
                            hidden
                            checked={expanded}
                            onChange={() => setExpanded(prev => !prev)} />
                        <i className={`icon-chevron ${expanded ? s.collapse : s.expand}`}/>
                    </label>
                )}
            </div>

            {user && expanded && (
                <div className={s.expanded}>
                    {postComments.map((comment, i) => <span key={comment.id}>#{i + 1}. {comment.text}</span>)}
                    <CommentForm postId={post.id}/>
                </div>
            )}
        </>
    );
}
