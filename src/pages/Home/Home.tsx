import Feed from "@/components/widgets/Feed"
import s from "./Home.module.scss"
import CreatePost from "@/components/widgets/CreatePost"
import Suggestions from "@/components/widgets/Suggestions";
import { PostsProvider } from "@/context/PostsContext";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
    const userId = useAppSelector(state => state.auth.userId)

    return (
        <PostsProvider>
            <div className={s.page}>
                {userId && <CreatePost/>}
                {userId && <Suggestions/>}
                <Feed/>
            </div>
        </PostsProvider>
    )
}
