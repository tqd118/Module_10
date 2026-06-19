import type { Post, User } from "@/types/social";
import s from "./PostActivity.module.scss"
import { useState } from "react";
import CommentForm from "../CommentForm";
import { useUser } from "@/context/UserContext";
import { useComments } from "@/hooks/useComments";

interface PostActivityProps {
    post: Post;
    onLike: (postId: number, liked: boolean, user: User) => void;
}

export default function PostActivity({post, onLike}: PostActivityProps) {
    const { user } = useUser();
    const { comments, fetchPostComments, createComment } = useComments();

    const [expanded, setExpanded] = useState(false);
    const liked = user ? post.likedByUsers.some(u => u.id === user.id) : false;

    const handleLike = () => {
        if (user) {
            onLike(post.id, liked, user);
        }
    }

    return (
        <>
            <div className={s.short}>
                <i className={`${s.likeIcon} ${liked ? "icon-like-filled" : "icon-like"}`} onClick={handleLike}/>
                <span>{post.likesCount} likes</span>

                <i className={`${s.commentsIcon} icon-comments`}/>
                {user ? (
                    <span>{post.commentsCount} comments</span>
                ) : (
                    <span>You have to login to see the comments</span>
                )}

                {user && (
                    <label className={s.expander}>
                        <input 
                            type="checkbox" 
                            hidden
                            checked={expanded}
                            onChange={() => {
                                setExpanded(prev => !prev);
                                if (!expanded) {
                                    fetchPostComments(post.id);
                                }
                            }} />
                        <i className={`icon-chevron ${expanded ? s.collapse : s.expand}`}/>
                    </label>
                )}
            </div>

            {user && expanded && (
                <div className={s.expanded}>
                    {comments.map((comment, i) => <span key={comment.id}>#{i + 1}. {comment.text}</span>)}
                    <CommentForm postId={post.id} onCreateComment={createComment} />
                </div>
            )}
        </>
    );
}
