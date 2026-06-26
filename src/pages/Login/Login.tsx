import { useState } from "react";
import s from "./Login.module.scss";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/context/ToastsContext";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    

    const validationSchema = object({
        email: string()
            .matches(
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                t("auth.emailNotValid"),
            )
            .required(
                t("forms.requiredField", {
                    field: t("auth.email"),
                }),
            ),

        password: string()
            .min(6, t("auth.passwordTooShort"))
            .required(
                t("forms.requiredField", {
                    field: t("auth.password"),
                }),
            ),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,

        onSubmit: async (values, { setFieldError }) => {
            setLoading(true);

            try {
                await login(values.email, values.password );
                showToast(t("auth.signInSuccess"), "success");
                navigate("/");
            } catch (e) {
                setFieldError(
                    "password",
                    e instanceof Error ? e.message : t("auth.invalidCredentials"),
                );
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className={s.page}>
            <div>
                <h2 className={s.heading}>
                    {t("auth.signInHeading")}
                </h2>

                <p className={s.subHeading}>
                    {t("auth.signInSubHeading")}
                </p>
            </div>

            <form
                className={s.form}
                onSubmit={formik.handleSubmit}
            >
                <InputField
                    type="email"
                    name="email"
                    label={t("auth.email")}
                    placeholder={t("auth.enterEmail")}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.email
                            ? formik.errors.email
                            : ""
                    }
                    success={
                        formik.touched.email &&
                        !formik.errors.email
                    }
                />

                <InputField
                    type="password"
                    name="password"
                    label={t("auth.password")}
                    placeholder={t("auth.enterPassword")}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.password
                            ? formik.errors.password
                            : ""
                    }
                    success={
                        formik.touched.password &&
                        !formik.errors.password
                    }
                />

                <Button
                    disabled={loading}
                    type="submit"
                >
                    {t("auth.signIn")}
                </Button>
            </form>

            <span className={s.signUp}>
                {t("auth.noAccount")}{" "}
                <Link to="/register">
                    {t("auth.signUp")}
                </Link>
            </span>
        </div>
    );
}