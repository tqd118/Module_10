import PostCard from "@/components/features/PostCard";
import s from "./Feed.module.scss"
import { useSocial } from "@/context/SocialContext";

export default function Feed() {
    const {state} = useSocial();

    return (
        <div className={s.feed}>
            {state.posts.map(post => <PostCard post={post} key={post.id}/>)}
        </div>
    )
}
