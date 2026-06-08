import Feed from "@/components/widgets/Feed"
import s from "./Home.module.scss"
import CreatePost from "@/components/widgets/CreatePost"
import { useUser } from "@/context/UserContext"
import Suggestions from "@/components/widgets/Suggestions";
import { PostsProvider } from "@/context/PostsContext";

export default function Home() {
    const { userId } = useUser();

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
