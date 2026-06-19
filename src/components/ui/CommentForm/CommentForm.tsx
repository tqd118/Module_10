import Button from "../Button";
import s from "./CommentForm.module.scss";
import { useUser } from "@/context/UserContext";
import { useForm,type SubmitHandler, } from "react-hook-form"

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
    const { userId } = useUser();
    const {
        register,
        handleSubmit,
        reset,
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
        reset();
    }

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="comment" className={s.label}>
                <span className={`${s.addCommentIcon} icon-pen`}>
                    Add a comment
                </span>
                <textarea
                    id="comment"
                    className={s.textarea}
                    placeholder="Write description here..."
                    {...register("content",
                        { required: true }
                    )}
                />
            </label>

            <Button className={s.submit} type="submit">Add a comment</Button>
        </form>
    );
}
