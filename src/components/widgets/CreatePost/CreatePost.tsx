import s from "./CreatePost.module.scss"
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/Button";
import { useState, lazy, Suspense } from "react";
import Modal from "@/components/ui/Modal";
import { getAssetUrl } from '@/utils/getAssetUrl';

const PostForm = lazy(() => import("@/components/features/PostForm"));

export default function CreatePost() {
    const { user } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={s.createPost}>
            <img src={getAssetUrl(user?.profileImage)} alt="avatar" className={s.userIcon}/>
            <span className={s.title}>What’s happening?</span>
            <Button
                onClick={() => setIsModalOpen(true)}
                className={s.button}
            >
                    Tell everyone
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Suspense fallback={<div className={s.fallback}>Loading</div>}>
                    <PostForm onClose={() => setIsModalOpen(false)} />
                </Suspense>
            </Modal>
        </div>
    );
}
