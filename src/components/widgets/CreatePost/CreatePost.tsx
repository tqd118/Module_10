import s from "./CreatePost.module.scss"
import Button from "@/components/ui/Button";
import { useState, lazy, Suspense } from "react";
import Modal from "@/components/ui/Modal";
import { getAssetUrl } from '@/utils/getAssetUrl';
import { useAppSelector } from "@/store/hooks";
import PostFormSkeleton from "@/components/features/PostForm/PostFormSkeleton";
import { useTranslation } from "react-i18next";

const PostForm = lazy(() => import("@/components/features/PostForm"));

export default function CreatePost() {
    const { t } = useTranslation();
    const user = useAppSelector(state => state.auth.user)

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={s.createPost}>
            <img src={getAssetUrl(user?.profileImage)} alt="avatar" className={s.userIcon}/>
            <span className={s.title}>{t("feed.postCreationGreeting")}</span>
            <Button
                onClick={() => setIsModalOpen(true)}
                className={s.button}
            >
                    {t("feed.postCreationButton")}
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Suspense fallback={<PostFormSkeleton />}>
                    <PostForm onClose={() => setIsModalOpen(false)} />
                </Suspense>
            </Modal>
        </div>
    );
}
