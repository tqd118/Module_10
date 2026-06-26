"use client";

import { useState } from "react";
import Image from "next/image";
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
    const { t } = useTranslation();
    const { count, unit } = formatTime(post.creationDate);

    const [imageRatio, setImageRatio] = useState(1);

    const avatarSrc = getAssetUrl(post.author?.profileImage);
    const imageSrc = getAssetUrl(post.image);

    return (
        <article className={s.post}>
            <div className={s.header}>
                {avatarSrc ? (
                    <Image
                        src={avatarSrc}
                        alt=""
                        width={48}
                        height={48}
                        className={s.avatar}
                    />
                ) : (
                    <div className={s.avatarPlaceholder} />
                )}

                <span className={s.userName}>
                    {post.author?.firstName || post.author?.username}
                </span>

                <span className={s.publishTime}>
                    {t(`timeAgo.${unit}`, { count })}
                </span>
            </div>

            <h3 className={s.title}>{post.title}</h3>

            {post.image && (
                <div
                    className={s.imageWrapper}
                    style={{ aspectRatio: imageRatio }}
                >
                    <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 720px"
                        className={s.image}
                        onLoad={(event) => {
                            const { naturalWidth, naturalHeight } =
                                event.currentTarget;

                            if (naturalWidth > 0 && naturalHeight > 0) {
                                setImageRatio(naturalWidth / naturalHeight);
                            }
                        }}
                    />
                </div>
            )}

            <p className={s.body}>{post.content}</p>

            <PostActivity post={post} onLike={onLike} />
        </article>
    );
}