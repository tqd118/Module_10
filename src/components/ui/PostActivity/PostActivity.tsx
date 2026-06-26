"use client"

import type { Post, User } from "@/types/social";
import s from "./PostActivity.module.scss"
import { useState, useRef, useEffect } from "react";
import CommentForm from "../CommentForm";
import { useComments } from "@/hooks/useComments";
import { useAppSelector } from "@/store/hooks";
import { useSpring, animated } from "@react-spring/web";
import { useTranslation } from "react-i18next";

interface PostActivityProps {
    post: Post;
    onLike: (postId: number, liked: boolean, user: User) => void;
}

export default function PostActivity({post, onLike}: PostActivityProps) {
    const { t } = useTranslation();
    const user = useAppSelector(state => state.auth.user);
    const { comments, fetchPostComments, createComment } = useComments();

    const [expanded, setExpanded] = useState(false);
    const liked = user ? post.likedByUsers.some(u => u.id === user.id) : false;

    const handleLike = () => {
        if (user) {
            onLike(post.id, liked, user);
        }
    }

    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [comments, expanded]);

    const expandAnimation = useSpring({
        height: expanded ? contentHeight : 0,
        opacity: expanded ? 1 : 0,
        overflow: "hidden",
        config: { tension: 600, friction: 30 },
    });

    return (
        <>
            <div className={s.short}>
                <i
                    key={liked ? "liked" : "unliked"}
                    className={`
                        ${s.likeIcon}
                        ${liked ? "icon-like-filled" : "icon-like"}
                        ${liked ? s.liked : ""}
                    `}
                    onClick={handleLike}
                />
                <span key={post.likesCount} className={s.likesCount}>
                    {t("feed.likes", { count: post.likesCount })}
                </span>

                <i className={`${s.commentsIcon} icon-comments`}/>
                {user ? (
                    <span>{t("feed.comments", {count: post.commentsCount})}</span>
                ) : (
                    <span>{t("feed.loginToComment")}</span>
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

            {user && (
                <animated.div ref={contentRef} style={expandAnimation} className={s.expanded}>
                    {comments.map((comment, i) => (
                        <span key={comment.id}>#{i + 1}. {comment.text}</span>
                    ))}
                    <CommentForm postId={post.id} onCreateComment={createComment} />
                </animated.div>
            )}
        </>
    );
}
