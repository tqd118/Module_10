import Button from "../Button";
import s from "./CommentForm.module.scss"
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";

interface CommentFormProps {
    postId: number;
    onCreateComment: (postId: number, text: string) => void;
}

export default function CommentForm({postId, onCreateComment}: CommentFormProps) {
    const { userId } = useUser();

    const [text, setText] = useState("");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() || !userId) {
            return;
        }

        onCreateComment(postId, text);
        setText("");
    }
    
    return (
        <form className={s.form} onSubmit={e => handleSubmit(e)}>
            <label htmlFor="comment" className={s.label}>
                <span className={`${s.addCommentIcon} icon-pen`}>Add a comment</span>
                <textarea 
                    id="comment" 
                    className={s.textarea} 
                    placeholder="Write description here..."
                    value={text}
                    onChange={e => setText(e.currentTarget.value)}/>
            </label>

            <Button text="Add a comment" className={s.submit}/>
        </form>
    );
}
