import Feed from "@/components/widgets/Feed"
import s from "./Home.module.scss"
import CreatePost from "@/components/widgets/CreatePost"
import { useUser } from "@/context/UserContext"
import Suggestions from "@/components/widgets/Suggestions";

export default function Home() {
    const { userId } = useUser();

    return (
        <div className={s.page}>
            {userId && <CreatePost/>}
            {userId && <Suggestions/>}
            <Feed/>
        </div>
    )
}
