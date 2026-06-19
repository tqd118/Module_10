import Button from "@/components/ui/Button";
import s from "./PostForm.module.scss";
import { useState } from "react";
import { usePostsContext } from "@/context/PostsContext";
import { useForm, type SubmitHandler } from "react-hook-form"

type ImageType = {
    link: string;
    name: string;
} | null;

interface Inputs {
    image: ImageType;
    title: string;
    description: string;
}

export default function PostForm({ onClose }: { onClose: () => void }) {
    const { createPost } = usePostsContext();

    const [isImageDragging, setIsImageDragging] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const handleFileSelect = (file?: File) => {
        if (!file) {
            return;
        }

        setValue("image", {
            link: URL.createObjectURL(file),
            name: file.name
        }, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createPost({
            title: data.title,
            content: data.description,
            image: data.image?.link,
        });

        onClose();
    };

    const image = watch("image");

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={s.heading}>
                Create a new post
                <button onClick={onClose} type="button">✕</button>
            </div>

            <label htmlFor="title">
                <i className="icon-mail" /> Post Title
            </label>
            <input
                type="text"
                id="title"
                className={`${s.textInput} ${s.titleInput}`}
                placeholder="Enter post title"
                
                {...register("title", {
                    required: true
                })}
            />
            {errors.title && <span>This field is required</span>}

            <label htmlFor="description">
                <i className="icon-pen" /> Description
            </label>
            <input
                type="text"
                id="description"
                className={`${s.textInput} ${s.descriptionInput}`}
                placeholder="Write description here..."
                
                {...register("description", {
                    required: true
                })}
            />
            {errors.description && <span>This field is required</span>}

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
                    
                    {...register("image", {
                        onChange: (e) => handleFileSelect(e.target.files?.[0])
                    })}
                />

                {image?.link ? (
                    <>
                        <img
                            src={image.link}
                            alt="your image"
                            className={s.previewImage}
                        />
                        <h4 className={s.previewName}>{image.name}</h4>
                    </>
                ) : (
                    <>
                        <i className={`${s.importIcon} icon-import`} />

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
                <Button className={s.button} type="submit">Create</Button>
            </div>
        </form>
    );
}
