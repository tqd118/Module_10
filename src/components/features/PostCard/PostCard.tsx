import type { Post, User } from "@/types/social";
import s from "./PostCard.module.scss";
import formatTime from "@/utils/formatTime";
import PostActivity from "@/components/ui/PostActivity";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { useTranslation } from "react-i18next";

interface PostCardProps {
    post: Post;
    onLike: (postId: number, liked: boolean, user: User) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
    const { t } = useTranslation()
    const { count, unit } = formatTime(post.creationDate);

    return (
        <article className={s.post}>
            <div className={s.header}>
                <img
                    src={getAssetUrl(post.author?.profileImage)}
                    alt="user"
                    className={s.avatar}
                />
                <span className={s.userName}>
                    {post.author?.firstName || post.author?.username}
                </span>
                <span className={s.publishTime}>
                    {t(`timeAgo.${unit}`, { count })}
                </span>
            </div>

            <h3 className={s.title}>{post.title}</h3>

            {post.image && (
                <img src={getAssetUrl(post.image)} alt="" className={s.image} />
            )}

            <p className={s.body}>{post.content}</p>

            <PostActivity post={post} onLike={onLike} />
        </article>
    );
}
