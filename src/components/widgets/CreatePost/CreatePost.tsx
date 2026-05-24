import s from "./CreatePost.module.scss"
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import PostForm from "@/components/features/PostForm";
import { useSocial } from "@/context/SocialContext";

export default function CreatePost() {
    const { userId } = useUser();
    const { state } = useSocial();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = state.users.find(user => user.id === userId);

    return (
        <div className={s.createPost}>
            <img src={user?.userIcon} alt="avatar" className={s.userIcon}/>
            <span className={s.title}>What’s happening?</span>
            <Button 
                text="Tell everyone" 
                handler={() => setIsModalOpen(true)}
                className={s.button}/>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PostForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
}
