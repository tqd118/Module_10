import s from "./CreatePost.module.scss"
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import PostForm from "@/components/features/PostForm";
import { getAssetUrl } from '@/utils/getAssetUrl';

export default function CreatePost() {
    const { user } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={s.createPost}>
            <img src={getAssetUrl(user?.profileImage)} alt="avatar" className={s.userIcon}/>
            <span className={s.title}>What’s happening?</span>
            <Button 
                text="Tell everyone" 
                onClick={() => setIsModalOpen(true)}
                className={s.button}/>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PostForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
}
