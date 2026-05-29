import type { Post } from "@/types/social";
import s from "./PostCard.module.scss"
import { useSocial } from "@/context/SocialContext";
import formatTime from "@/utils/formatTime"
import PostActivity from "@/components/ui/PostActivity";
import { getAssetUrl } from '@/utils/getAssetUrl';

export default function PostCard({post}: {post: Post}) {
    const {state} = useSocial()
    const author = state.users.find(user => user.id === post.authorId)

    const authorName = author?.userFullName.split(" ")[0];

    return (
        <article className={s.post}>
            <div className={s.header}>
                <img src={getAssetUrl(author?.userIcon)} alt="user" className={s.avatar}/>
                <span className={s.userName}>{authorName}</span>
                <span className={s.publishTime}>{formatTime(post.createdAt)} ago</span>
            </div>
            
            {post.image && <img src={post.image} alt="" className={s.image}/>}

            <p className={s.body}>{post.text}</p>

            <PostActivity post={post}/>
        </article>
    );
}
