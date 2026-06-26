import { useAppSelector } from "@/store/hooks";
import Button from "../Button";
import s from "./CommentForm.module.scss";
import { useForm,type SubmitHandler, } from "react-hook-form"
import { useTranslation } from "react-i18next";

interface CommentFormProps {
    postId: number;
    onCreateComment: (postId: number, text: string) => void;
}
interface Inputs {
    content: string;
}

export default function CommentForm({
    postId,
    onCreateComment,
}: CommentFormProps) {
    const { t } = useTranslation();
    const userId = useAppSelector(state => state.auth.userId);
    const {
        register,
        handleSubmit,
        resetField,
    } = useForm<Inputs>({
        defaultValues: {
            content: ""
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (!data.content.trim() || !userId) {
            return;
        }

        onCreateComment(postId, data.content);
        resetField("content");
    }

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="comment" className={s.label}>
                <span className={`${s.addCommentIcon} icon-pen`}>
                    {t("forms.addComment")}
                </span>
                <textarea
                    id="comment"
                    className={s.textarea}
                    placeholder={t("forms.description")}
                    {...register("content",
                        { required: true }
                    )}
                />
            </label>

            <Button className={s.submit} type="submit">{t("forms.addComment")}</Button>
        </form>
    );
}
