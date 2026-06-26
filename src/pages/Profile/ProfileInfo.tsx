import s from "./Profile.module.scss";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastsContext";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { update } from "@/store/authSlice";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileInfo() {
    const { t, i18n } = useTranslation();
    const { theme, toggle } = useTheme();
    const { showToast } = useToast();
    const { logout } = useAuth()
    const [currentValues, setCurrentValues] = useState<typeof formik.initialValues | null>(null)

    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    const toggleLanguage = () => {
        void i18n.changeLanguage(
            i18n.resolvedLanguage === "ru" ? "en" : "ru"
        );
    };

    const validationSchema = object().shape({
        firstName: string().required(t("forms.requiredField", {
            field: t("profile.firstName")
        })),
        secondName: string().required(t("forms.requiredField", {
            field: t("profile.secondName")
        })),

        username: string()
            .required(t("forms.requiredField", {
                field: t("profile.username")
            }))
            .matches(
                /^[a-zA-Z0-9_]+$/,
                t("profile.usernameNotValid"),
            ),

        email: string()
            .required(t("forms.requiredField", {
                field: t("auth.email")
            }))
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("auth.emailNotValid")),

        description: string().max(200),
    });

    const formik = useFormik({
        initialValues: {
            profileImage: user?.profileImage,
            firstName: user?.firstName,
            secondName: user?.secondName,
            username: user?.username,
            email: user?.email,
            description: user?.description,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!user) return;

            const current = currentValues || formik.initialValues;
            if ((Object.keys(current) as Array<keyof typeof current>).every((key) => current[key] === values[key])) {
                return;
            }

            await dispatch(update(values));
            showToast("Profile info has been updated successfully", "success");
            setCurrentValues(values);
        },
    });

    const handleIconSelect = (file?: File) => {
        if (!file) return;
        formik.setFieldValue("profileImage", URL.createObjectURL(file));
    };

    const handleLogout = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        logout();
    };

    const {
        profileImage,
        firstName,
        secondName,
        description,
        email,
        username,
    } = formik.values;

    const { handleChange, errors } = formik;
    const [fullNameInput, setFullNameInput] = useState(
        `${firstName} ${secondName}`.trim(),
    );

    return (
        <div className={s.info}>
            <form
                className={s.profile}
                id="changeProfile"
                onSubmit={formik.handleSubmit}
            >
                <h2 className={s.title}>{t("profile.editProfile")}</h2>

                <div className={s.user}>
                    <img
                        src={
                            getAssetUrl(profileImage) ||
                            "/Module_10/assets/blank-user.png"
                        }
                        alt="avatar"
                    />

                    <div>
                        <span>{firstName + " " + secondName}</span>

                        <label className={s.changePhoto} htmlFor="profileImage">
                            {t("profile.changePhoto")}
                        </label>

                        <input
                            hidden
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={(e) =>
                                handleIconSelect(e.target.files?.[0])
                            }
                        />
                    </div>
                </div>

                <label className={s.inputLabel}>
                    <span className="icon-user">{t("profile.username")}</span>

                    <input
                        id="username"
                        name="username"
                        className={s.profileInput}
                        placeholder="@username123"
                        form="changeProfile"
                        value={username}
                        onChange={handleChange}
                    />

                    {errors.username && (
                        <span className={s.error}>{errors.username}</span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-user">{t("profile.fullName")}</span>
                    <input
                        id="fullName"
                        name="fullName"
                        className={s.profileInput}
                        placeholder="John Doe"
                        form="changeProfile"
                        value={fullNameInput}
                        onChange={(e) => {
                            const raw = e.target.value;
                            setFullNameInput(raw);

                            const [first = "", ...rest] = raw.split(" ");
                            formik.setFieldValue("firstName", first.trim());
                            formik.setFieldValue(
                                "secondName",
                                rest.join(" ").trim(),
                            );
                        }}
                        onBlur={() => {
                            setFullNameInput(
                                `${firstName} ${secondName}`.trim(),
                            );
                            formik.setFieldTouched("firstName", true);
                            formik.setFieldTouched("secondName", true);
                        }}
                    />
                    {(formik.touched.firstName || formik.touched.secondName) &&
                        (errors.firstName || errors.secondName) && (
                            <span className={s.error}>
                                {errors.firstName || errors.secondName}
                            </span>
                        )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-mail">{t("auth.email")}</span>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={s.profileInput}
                        placeholder="email@domain.com"
                        form="changeProfile"
                        value={email}
                        onChange={handleChange}
                    />

                    {errors.email && (
                        <span className={s.error}>{errors.email}</span>
                    )}
                </label>

                <label className={s.inputLabel}>
                    <span className="icon-pen">{t("profile.description")}</span>

                    <textarea
                        id="description"
                        name="description"
                        className={s.profileInput}
                        placeholder="Write description here..."
                        form="changeProfile"
                        value={description}
                        onChange={handleChange}
                    />

                    <span className={s.descriptionWarn}>
                        {errors.description ? (
                            <span className={`icon-info ${s.error}`}>
                                {t("profile.reachedCharsLimit")}                                
                            </span>
                        ) : (
                            <span className="icon-info">{t("profile.charsLimit")} </span>
                        )}
                    </span>
                </label>

                <Button
                    className={s.saveInfoButton}
                    type="submit"
                    form="changeProfile"
                >
                    {t("profile.saveChanges")}
                </Button>
            </form>

            <form className={s.preferences} onSubmit={(e) => handleLogout(e)}>
                <h2 className={s.title}>{t("profile.preferences")}</h2>

                <label className={s.preferencesSwitch}>
                    <input type="checkbox" checked={theme === "dark"} onChange={toggle} hidden />
                    <span className={s.slider} />
                    <span className={s.switchTitle}>{t("profile.darkTheme")}</span>
                </label>

                <label className={s.preferencesSwitch}>
                    <input type="checkbox" checked={i18n.resolvedLanguage === "ru"} onChange={toggleLanguage} hidden />
                    <span className={s.slider} />
                    <span className={s.switchTitle}>{t("profile.languageSwitch")}</span>
                </label>

                <h2 className={s.title}>{t("profile.actions")}</h2>

                <Button className={s.logoutButton}>{t("profile.logout")}</Button>
            </form>
        </div>
    );
}
