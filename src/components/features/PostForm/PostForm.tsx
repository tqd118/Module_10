import Button from "@/components/ui/Button";
import s from "./PostForm.module.scss"
import React, { useState } from "react";
import { useSocial } from "@/context/SocialContext";
import { useUser } from "@/context/UserContext";

type ImageType =  {
    link: string;
    name: string;
} | null

export default function PostForm({onClose}: {onClose: () => void}) {
    const { state, dispatch } = useSocial();
    const { userId } = useUser();

    const user = state.users.find(user => user.id === userId);

    const [isImageDragging, setIsImageDragging] = useState(false);
    const [image, setImage] = useState<ImageType>(null);
    const [description, setDescription] = useState("");

    const handleFileSelect = (file?: File) => {
        if (!file) {
            return;
        }

        setImage({
            link: URL.createObjectURL(file),
            name: file.name
        });
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !description) {
            return;
        }

        dispatch({
            type: "CREATE_POST",
            payload: {
                authorId: user.id, 
                text: description,
                image: image?.link
            }
        });

        onClose();
    }

    return (
        <form className={s.form} onSubmit={e => handleSubmit(e)}>
            <div className={s.heading}>
                Create a new post
                <button onClick={onClose}>✕</button>
            </div>

            <label htmlFor="description">
                <i className="icon-pen"/> Description
            </label>
            <input 
                type="text" 
                id="description" 
                className={`${s.textInput} ${s.descriptionInput}`} 
                placeholder="Write description here..."
                value={description}
                onChange={e => setDescription(e.currentTarget.value)}/>

            <label
                className={`${s.imgField} ${isImageDragging ? s.dragging : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsImageDragging(true);
                }}
                onDragLeave={() => {
                    setIsImageDragging(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsImageDragging(false);

                    handleFileSelect(e.dataTransfer.files[0]);
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                        handleFileSelect(e.target.files?.[0])
                    }
                />

                {image ? (
                    <>
                        <img src={image.link} alt="your image" className={s.previewImage}/>
                        <h4 className={s.previewName}>{image.name}</h4>
                    </>
                ) : (
                    <>
                        <i className={`${s.importIcon} icon-import`}/>
                    
                        <div>
                            <p className={s.imgFieldTitle}>
                                Select a file or drag and drop here
                            </p>

                            <p className={s.imgFieldSubtitle}>
                                JPG, PNG or PDF, file size no more than 10MB
                            </p>
                        </div>
                    </>
                )}
            </label>

            <div className={s.footer}>
                <Button text="Create" className={s.button}/>
            </div>
        </form>
    );
}
