import { useState } from "react";
import s from "./Register.module.scss";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useToast } from "@/context/ToastsContext";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth()

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
                await signup(values.email, values.password);
                showToast(t("auth.signUpSuccess"), "success");
            } catch (e) {
                setFieldError(
                    "password",
                    e instanceof Error ? e.message : t("auth.registrationFailed"),
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const passwordStrength =
        formik.values.password.length >= 8
            ? t("auth.strongPassword")
            : "";

    return (
        <div className={s.page}>
            <div>
                <h2 className={s.heading}>
                    {t("auth.signUpHeading")}
                </h2>

                <p className={s.subHeading}>
                    {t("auth.signUpSubHeading")}
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
                    hint={passwordStrength}
                />

                <Button
                    disabled={loading}
                    type="submit"
                >
                    {t("auth.signUp")}
                </Button>
            </form>

            <p className={s.policy}>
				{t("auth.termsAgreement")}{" "}
				<a href="#">
					{t("auth.termsOfService")}
				</a>{" "}
				{t("auth.and")}{" "}
				<a href="#">
					{t("auth.privacyPolicy")}
				</a>
			</p>

            <span className={s.signIn}>
                {t("auth.hasAccount")}{" "}
                <Link to="/login">
                    {t("auth.signIn")}
                </Link>
            </span>
        </div>
    );
}