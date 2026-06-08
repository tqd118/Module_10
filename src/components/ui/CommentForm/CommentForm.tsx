import { useSocial } from "@/context/SocialContext";
import Button from "../Button";
import s from "./CommentForm.module.scss"
import { useUser } from "@/context/UserContext";
import type { Post } from "@/types/social";
import React, { useState } from "react";

export default function CommentForm({postId}: {postId: Post["id"]}) {
    const {dispatch} = useSocial();
    const { userId } = useUser();

    const [text, setText] = useState("");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() || !userId) {
            return;
        }
        dispatch({
            type: "CREATE_COMMENT",
            payload: {
                authorId: userId,
                postId: postId,
                text
            }
        });

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
