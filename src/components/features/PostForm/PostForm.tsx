"use client";

import Button from "@/components/ui/Button";
import s from "./PostForm.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePostsContext } from "@/context/PostsContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const { createPost } = usePostsContext();

    const [isImageDragging, setIsImageDragging] = useState(false);
    const [previewRatio, setPreviewRatio] = useState(1);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const image = watch("image");

    const handleFileSelect = (file?: File) => {
        if (!file) {
            return;
        }

        const link = URL.createObjectURL(file);

        setPreviewRatio(1);

        setValue(
            "image",
            {
                link,
                name: file.name,
            },
            { shouldValidate: true, shouldDirty: true }
        );
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createPost({
            title: data.title,
            content: data.description,
            image: data.image?.link,
        });

        onClose();
    };

    useEffect(() => {
        if (!image?.link) {
            setPreviewRatio(1);
            return;
        }

        return () => {
            if (image.link.startsWith("blob:")) {
                URL.revokeObjectURL(image.link);
            }
        };
    }, [image?.link]);

    return (
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={s.heading}>
                {t("forms.createPost")}
                <button onClick={onClose} type="button">
                    ✕
                </button>
            </div>

            <label htmlFor="title">
                <i className="icon-mail" />
                {t("forms.titleLabel")}
            </label>
            <input
                type="text"
                id="title"
                className={`${s.textInput} ${s.titleInput}`}
                placeholder={t("forms.title")}
                {...register("title", {
                    required: true,
                })}
            />
            {errors.title && <span>{t("forms.required")}</span>}

            <label htmlFor="description">
                <i className="icon-pen" />
                {t("forms.descriptionLabel")}
            </label>
            <input
                type="text"
                id="description"
                className={`${s.textInput} ${s.descriptionInput}`}
                placeholder={t("forms.description")}
                {...register("description", {
                    required: true,
                })}
            />
            {errors.description && <span>{t("forms.required")}</span>}

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
                        onChange: (e) => handleFileSelect(e.target.files?.[0]),
                    })}
                />

                {image?.link ? (
                    <>
                        <div
                            className={s.previewWrapper}
                            style={{ aspectRatio: previewRatio }}
                        >
                            <Image
                                src={image.link}
                                alt={image.name}
                                fill
                                unoptimized
                                sizes="(max-width: 480px) 100vw, 320px"
                                className={s.previewImage}
                                onLoad={(event) => {
                                    const { naturalWidth, naturalHeight } =
                                        event.currentTarget;

                                    if (naturalWidth > 0 && naturalHeight > 0) {
                                        setPreviewRatio(
                                            naturalWidth / naturalHeight
                                        );
                                    }
                                }}
                            />
                        </div>

                        <h4 className={s.previewName}>{image.name}</h4>
                    </>
                ) : (
                    <>
                        <i className={`${s.importIcon} icon-import`} />

                        <div>
                            <p className={s.imgFieldTitle}>
                                {t("forms.fileIsnstruction")}
                            </p>

                            <p className={s.imgFieldSubtitle}>
                                {t("forms.fileConstrains")}
                            </p>
                        </div>
                    </>
                )}
            </label>

            <div className={s.footer}>
                <Button className={s.button} type="submit">
                    {t("forms.create")}
                </Button>
            </div>
        </form>
    );
}